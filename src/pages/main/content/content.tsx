import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import store from "../../../store/store";
import "./content.scss";
import { ImageType } from "../../../schemas/images";
import { idText } from "typescript";
import Album from "./album/album";
import { SectionType, isSection, isSections } from "../../../schemas/sections";
import { isAbout } from "../../../schemas/about";
import About from "./about/about";

function Content() {
	return (
		<>
			{store.currentContent &&
				((Array.isArray(store.currentContent) &&
					isSections(store.currentContent)) ||
					isSection(store.currentContent)) && (
					<Album
						currentSections={
							Array.isArray(store.currentContent)
								? store.currentContent
								: [store.currentContent]
						}
					></Album>
				)}
			{store.currentContent && isAbout(store.currentContent) && (
				<About about={store.currentContent}></About>
			)}
		</>
	);
}

export default observer(Content);
