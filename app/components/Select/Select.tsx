import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  MouseEvent,
  KeyboardEvent,
} from "react";
import classNames from "classnames";
import { Transition } from "../Transition";
import SelectItem, { SelectItemOption } from "./SelectItem";
import SelectContext from "./SelectContext";
import DeleteIcon from "@/assets/icons/delete.svg";
import LoadingIcon from "@/assets/icons/circle-loading.svg";
import Input from "../Input";
import Tag from "../Tag";

type BaseSelectProps = {
  option: SelectItemOption[];
  readOnly?: boolean;
  placeholder?: string;
  onDropDownVisibleChange?: (visible: boolean) => void;
  loading?: boolean;
  children?: undefined;
};

type CustomRenderChildrenProps = Omit<
  BaseSelectProps,
  "option" | "loading" | "children"
> & {
  option?: undefined;
  loading?: undefined;
  children: JSX.Element | JSX.Element[];
};

type MultipleSelectProps = (BaseSelectProps | CustomRenderChildrenProps) & {
  value: SelectItemOption[];
  multiple: true;
  onSelect?: (value: SelectItemOption) => void;
  onChange?: (value: SelectItemOption[]) => void;
  allowCreate?: boolean | ((input: string) => boolean);
  onInput?: (value: string) => void;
  onCreate?: (value: SelectItemOption) => void;
};

type SelectProps = (BaseSelectProps | CustomRenderChildrenProps) & {
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
    children,
  } = props;
  const [input, setInput] = useState("");
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [createdOptions, setCreatedOptions] = useState<SelectItemOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUnselect = useCallback(
    (v: SelectItemOption) => {
      if (multiple) {
        if (v.isCreated) {
          setCreatedOptions((p) => p.filter((el) => el.value !== v.value));
        }
        onChange?.(value.filter((item) => item.value !== v.value));
      }
    },
    [value],
  );

  const handleSelect = useCallback(
    (v: SelectItemOption) => {
      if (multiple) {
        if (value.find((item) => item.value === v.value)) {
          handleUnselect(v);
          return;
        }
        onSelect?.(v);
        onChange?.(value.concat(v));
      } else {
        setInput(v.label);
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
        if (!input || loading) {
          return;
        }
        if (typeof allowCreate === "function" && !allowCreate(input)) {
          return;
        }
        if (!allowCreate) {
          return;
        }
        if (
          value.find((item) => item.value === input || item.label === input)
        ) {
          return;
        }
        const _createdOption = createdOptions.find((el) => el.value === input);
        if (_createdOption) {
          return;
        }
        setInput("");
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
    [allowCreate, value, option, createdOptions, input, loading],
  );

  const handleFocus = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsShowDropDown(true);
    inputRef.current?.focus();
  }, []);

  const _isSelected = useCallback(
    (target: SelectItemOption) => {
      if (Array.isArray(value)) {
        return !!value.find((item) => item.value === target.value);
      }
      return value.value === target.value;
    },
    [value],
  );

  const selectContextValue = useMemo(() => {
    return { handleSelect, isSelected: _isSelected };
  }, [value, handleSelect]);

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
    <SelectContext.Provider value={selectContextValue}>
      <div className="relative" onClick={handleFocus}>
        <div
          className={classNames(
            "cursor-pointer border-2 border-transparent transition-all duration-300",
            isShowDropDown && "border-sky-400",
          )}
        >
          {multiple &&
            value.map((v) => (
              <Tag key={v.value} deletable onDelete={() => handleUnselect(v)}>
                {v.label}
              </Tag>
            ))}
          <Input
            type="plain"
            className="cursor-pointer p-1 border-none outline-none"
            placeholder={placeholder}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            value={input}
            onInput={(text) => {
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
          <div className="absolute z-50 bg-[--select-background-color] p-1 w-full rounded shadow-xl origin-top">
            {loading ? (
              <div className="p-4 relative">
                <LoadingIcon
                  height={22}
                  width={22}
                  className="absolute left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            ) : children ? (
              children
            ) : option.length === 0 ? (
              <div className="p-4 text-center text-gray-400">没有数据</div>
            ) : (
              option.map((el) => <SelectItem item={el} key={el.value} />)
            )}
          </div>
        </Transition>
      </div>
    </SelectContext.Provider>
  );
}
