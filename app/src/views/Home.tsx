import React from "react";

import styles from "./Home.module.scss";

export default class Home extends React.Component {
	render() {
		return (
			<div className={styles.red}>This is a test.</div>
		);
	}
}