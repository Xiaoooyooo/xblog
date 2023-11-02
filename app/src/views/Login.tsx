import React, { ReactNode } from "react";

import styles from "./Login.module.scss";
import Button from "@/components/_Base/Button";
import Input from "@/components/_Base/Input";

class LoginComponent extends React.Component {
  signup(): void {
    console.log("signup");
  }
  signin(): void {
    console.log("signin");
  }
  render(): ReactNode {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.cover}></div>
        <div className={styles.form}>
          <label className={styles.formItem}>
            <span>Username:</span>
            <div className={styles.inputBox}>
              <Input type="text" />
            </div>
          </label>
          <label className={styles.formItem}>
            <span>Password:</span>
            <div className={styles.inputBox}>
              <Input type="password" />
            </div>
          </label>
          <label className={styles.formItem}>
            <span>Comfirm Password:</span>
            <div className={styles.inputBox}>
              <Input type="password" />
            </div>
          </label>
          <div className={styles.actions}>
            <Button className={styles.signup} onClick={this.signup}>
              Signup
            </Button>
            <Button className={styles.signin} onClick={this.signin}>
              Signin
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default class Login extends React.Component {
  render(): ReactNode {
    return (
      <div className={styles.container}>
        <LoginComponent />
      </div>
    );
  }
}
