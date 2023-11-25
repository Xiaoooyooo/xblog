import {
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent,
  KeyboardEvent,
} from "react";
import classNames from "classnames";
import { Transition } from "../Transition";
import DeleteIcon from "@/assets/icons/delete.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";

export type SelectItemOption = {
  label: string;
  value: string;
  isCreated?: boolean;
};
type BaseSelectProps = {
  option: SelectItemOption[];
  readOnly?: boolean;
  placeholder?: string;
  onDropDownVisibleChange?: (visible: boolean) => void;
  loading?: boolean;
};

type MultipleSelectProps = BaseSelectProps & {
  value: SelectItemOption[];
  multiple: true;
  onSelect?: (value: SelectItemOption) => void;
  onChange?: (value: SelectItemOption[]) => void;
  allowCreate?: boolean;
  onInput?: (value: string) => void;
  onCreate?: (value: SelectItemOption) => void;
};

type SelectProps = BaseSelectProps & {
  value: SelectItemOption;
  multiple?: false;
  onSelect?: (value: SelectItemOption) => void;
  onChange?: (value: SelectItemOption) => void;
  allowCreate?: undefined;
  onInput?: (value: string) => void;
  onCreate?: undefined;
};

export default function Select(props: SelectProps | MultipleSelectProps) {
  const {
    value,
    option,
    readOnly = false,
    multiple,
    onSelect,
    onChange,
    placeholder,
    allowCreate,
    onInput,
    onDropDownVisibleChange,
    loading,
    onCreate,
  } = props;
  const [input, setInput] = useState("");
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [createdOptions, setCreatedOptions] = useState<SelectItemOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUnselect = useCallback(
    (v: SelectItemOption) => {
      if (multiple) {
        onChange?.(value.filter((item) => item.value !== v.value));
      }
    },
    [value],
  );

  const handleSelect = useCallback(
    (v: SelectItemOption) => {
      if (multiple) {
        if (value.find((item) => item.value === v.value)) {
          if (
            allowCreate &&
            createdOptions.find((el) => el.value === v.value)
          ) {
            setCreatedOptions((p) => p.filter((el) => el.value !== v.value));
          }
          handleUnselect(v);
        } else {
          onSelect?.(v);
          onChange?.(value.concat(v));
        }
      } else {
        onSelect?.(v);
        onChange?.(v);
      }
    },
    [multiple, value, allowCreate, createdOptions, handleUnselect],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      if (key === "Enter") {
        if (!allowCreate || !input || loading) {
          return;
        }
        setInput("");
        const _option = option.find((item) => item.label === input);
        if (_option) {
          handleSelect(_option);
          return;
        }
        const _createdOption = createdOptions.find((el) => el.value === input);
        if (_createdOption) {
          handleSelect(_createdOption);
          return;
        }
        const createdItem: SelectItemOption = {
          label: input,
          value: input,
          isCreated: true,
        };
        setCreatedOptions([...createdOptions, createdItem]);
        onCreate?.(createdItem);
        onChange?.([...value, createdItem]);
      }
    },
    [allowCreate, option, createdOptions, input, loading, handleSelect],
  );

  const handleFocus = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsShowDropDown(true);
    inputRef.current?.focus();
  }, []);

  const _isSelected = useCallback(
    (
      value: SelectItemOption | SelectItemOption[],
      target: SelectItemOption,
    ) => {
      if (Array.isArray(value)) {
        return value.find((item) => item.value === target.value);
      }
      return value.value === target.value;
    },
    [],
  );

  useEffect(() => {
    onDropDownVisibleChange?.(isShowDropDown);
  }, [isShowDropDown]);

  useEffect(() => {
    function handleDocumentClick() {
      setIsShowDropDown(false);
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <div className="relative" onClick={handleFocus}>
      <div
        className={classNames(
          "cursor-pointer border-2 border-transparent transition-all duration-300",
          isShowDropDown && "border-sky-400",
        )}
      >
        {multiple &&
          value.map((v) => (
            <div
              key={v.value}
              className="inline-block ml-1 border bg-slate-100 border-slate-300 rounded-sm"
            >
              <div className="flex justify-center items-center">
                <span className="px-1">{v.label}</span>
                <span onClick={() => handleUnselect(v)}>
                  <DeleteIcon height={18} width={18} />
                </span>
              </div>
            </div>
          ))}
        <input
          type="text"
          className="cursor-pointer ml-1 p-1 border-none outline-none"
          placeholder={placeholder}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          value={input}
          onInput={(e) => {
            const text = (e.target as HTMLInputElement).value;
            onInput?.(text);
            setInput(text);
          }}
        />
      </div>
      <Transition
        show={isShowDropDown}
        duration={200}
        beforeEnterClassName="opacity-0 scale-y-50"
        enterActiveClassName="transition-all duration-200"
        beforeLeaveClassName="opacity-100"
        leaveActiveClassName="transition-all duration-200"
        leaveDoneClassName="opacity-0 scale-y-50"
        unmountOnHide
      >
        <div className="absolute z-50 bg-white p-1 w-full rounded shadow-xl origin-top">
          {loading ? (
            <div className="p-4 relative">
              <LoadingIcon
                height={22}
                width={22}
                className="absolute left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          ) : option.length === 0 ? (
            <div className="p-4 text-center text-gray-400">没有数据</div>
          ) : (
            option.map((el) => (
              <div
                key={el.value}
                className={classNames(
                  "p-2 cursor-pointer hover:bg-slate-400 transition-all duration-200",
                  _isSelected(value, el) && "bg-sky-200",
                )}
                onClick={() => handleSelect(el)}
              >
                {el.label}
              </div>
            ))
          )}
        </div>
      </Transition>
    </div>
  );
}
