import React from "react";

import classNames from "classnames";

function Footer() {
  return (
    <footer className={classNames("text-slate-400 text-md text-center m-2")}>
      <div className="text-sm">起舞弄清影，何似在人间、</div>
      {__BEIAN__ && (
        <div className="text-xs">
          <a href="http://beian.miit.gov.cn/">{__BEIAN__}</a>
        </div>
      )}
    </footer>
  );
}

export default Footer;
