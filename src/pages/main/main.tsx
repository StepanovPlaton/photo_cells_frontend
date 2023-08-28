import React, { useState } from "react";

import Menu from "./menu/menu";

import "./main.scss";
import Content from "./content/content";

function MainPage() {
	const [openMenu, changeOpenMenu] = useState<boolean>(true);

	return (
		<div className="main">
			<div className={"menu_wrapper " + (openMenu ? "open" : "")}>
				<Menu onOpen={() => changeOpenMenu(false)}></Menu>
			</div>
			<div className="content_wrapper">
				<Content></Content>
			</div>
			<div
				className="open_menu"
				style={{ opacity: +!openMenu }}
				onClick={() => changeOpenMenu(true)}
			>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}

export default MainPage;
