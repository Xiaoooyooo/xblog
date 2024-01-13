import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { useSiteConfig, useUpdateSiteConfig } from "@/services/siteconfig";
import { SiteConfig } from "@/types";
import { Form, FormItem } from "@/components/Form";
import Switch from "@/components/Switch";
import message from "@/components/Message/message";

export default function AdminScence() {
  const [config, setConfig] = useState({} as SiteConfig);
  const {
    isLoading: isGetConfigLoading,
    isSuccess: isGetConfigSuccess,
    result: originConfig,
  } = useSiteConfig();
  const {
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    result: newConfig,
    isError: isUpdateError,
    error: updateError,
    fetchFn: updateFn,
  } = useUpdateSiteConfig();
  const handleSave = useCallback(() => {
    if (isUpdateLoading) {
      return;
    }
    updateFn(config);
  }, [config, isUpdateLoading]);

  useEffect(() => {
    if (isGetConfigSuccess) {
      setConfig(originConfig);
    }
  }, [isGetConfigSuccess, originConfig]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setConfig(newConfig);
      message({ type: "success", message: "更新成功" });
    } else if (isUpdateError) {
      message({ type: "error", message: updateError.message || "更新失败" });
    }
  }, [isUpdateSuccess, newConfig, isUpdateError, updateError]);

  if (isGetConfigLoading) {
    return <div>loading...</div>;
  }

  return (
    <ContentContainer>
      <div className="sticky top-[--header-height] py-2 flex justify-end">
        <Button loading={isUpdateLoading} onClick={handleSave}>
          保存
        </Button>
      </div>
      <div>
        <Form>
          <FormItem label="是否允许新用户注册：">
            <Switch
              value={config.allowRegister}
              onChange={() =>
                setConfig((p) => ({ allowRegister: !p.allowRegister }))
              }
            />
          </FormItem>
        </Form>
      </div>
    </ContentContainer>
  );
}
