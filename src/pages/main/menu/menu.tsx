import React, { useEffect, useRef, useState } from "react";

import "./menu.scss";
import logo from "../../../assets/images/logo.png";
import store from "../../../store/store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import SectionItem from "./section_item/section_item";
import FolderItem from "./folder_item/folder_item";
import AddSection from "./add_section/add_section";
import AddFolder from "./add_folder/add_folder";
import authStore from "../../../store/auth";
import { isAbout } from "../../../schemas/about";
import { isSection } from "../../../schemas/sections";

function Menu(props: { onOpen: () => void }) {
	const [countOfLogoClicks, changeCountOfLogoClicks] = useState<number>(0);
	const [logoClickCoolDown, changeLogoClickCoolDown] =
		useState<NodeJS.Timeout>();
	const navigate = useNavigate();

	return (
		<div className="menu flex_column">
			<div className="logo_wrapper">
				<img
					className="logo"
					src={logo}
					alt=""
					onClick={(e) => {
						e.stopPropagation();
						if (logoClickCoolDown) clearTimeout(logoClickCoolDown);
						changeLogoClickCoolDown(
							setTimeout(() => {
								changeCountOfLogoClicks(0);
							}, 500)
						);
						changeCountOfLogoClicks(countOfLogoClicks + 1);
						if (countOfLogoClicks > 5) navigate("/auth");
					}}
				></img>
			</div>
			<div className="categories">
				{authStore.authorized && (
					<div className="category_block flex_column">
						<div
							className={
								"category " +
								(store.currentContent &&
								Array.isArray(store.currentContent) &&
								store.currentContent.length === 1 &&
								isSection(store.currentContent[0]) &&
								store.currentContent[0].section === "Overview"
									? "active"
									: "")
							}
							onClick={() => {
								store.openOverview();
							}}
						>
							Overview
						</div>
					</div>
				)}

				<div className="category_block flex_column">
					{store.sections &&
						store.sections.map((section, index) => (
							<SectionItem
								section={section}
								key={index}
								onOpen={() => props.onOpen()}
							></SectionItem>
						))}
					<AddSection></AddSection>
				</div>

				{store.folders &&
					store.folders.map((folder, index) => (
						<FolderItem
							folder={folder}
							key={index}
							onOpen={() => props.onOpen()}
						></FolderItem>
					))}
				<AddFolder></AddFolder>

				<div className="category_block flex_column">
					<div
						className={
							"category " +
							(store.currentContent &&
							isAbout(store.currentContent)
								? "active"
								: "")
						}
						onClick={() => {
							store.openAbout();
						}}
					>
						About Me
					</div>
					{/* <div className="category">Reach Me</div> */}
				</div>
			</div>
		</div>
	);
}

export default observer(Menu);
