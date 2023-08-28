import React, { useRef, useState } from "react";

import "./folder_item.scss";
import { SectionWithInfoType, isSections } from "../../../../schemas/sections";
import store from "../../../../store/store";
import authStore from "../../../../store/auth";
import { FolderType } from "../../../../schemas/folders";
import SectionItem from "../section_item/section_item";
import SectionList from "../../../../components/section_list/section_list";
import { observer } from "mobx-react-lite";
import TrashIcon from "../../../../components/icons/trach_icon";

function FolderItem(props: { folder: FolderType; onOpen: () => void }) {
	const [itemEdit, changeItemEdit] = useState<boolean>();
	const changeNameRef = useRef<HTMLInputElement>(null);
	const [doubleClickTimeout, changeDoubleClickTimeout] =
		useState<NodeJS.Timeout>();
	const clickHandler = (e: any, open: () => void, folder: FolderType) => {
		e.stopPropagation();
		if (e.detail === 1) {
			if (itemEdit) {
				changeItemEdit(false);
				if (changeNameRef && changeNameRef.current) {
					if (changeNameRef.current) {
						store.changeFolderName(
							folder.folderId,
							changeNameRef.current.value
						);
					}
				}

				return;
			}
			clearTimeout(doubleClickTimeout);
			changeDoubleClickTimeout(setTimeout(() => open(), 300));
		}
		if (e.detail === 2) {
			clearTimeout(doubleClickTimeout);
			open();
			if (authStore.authorized) changeItemEdit(true);
		}
	};

	return (
		<>
			<div className="category_block flex_column">
				<span
					className={
						"category stand_alone " +
						(Array.isArray(store.currentContent) &&
						isSections(store.currentContent) &&
						store.currentContent?.every((section) =>
							props.folder.sections.includes(section)
						) &&
						store.currentContent.length ===
							props.folder.sections.length
							? "active"
							: "")
					}
					onClick={(e) => {
						clickHandler(
							e,
							() => {
								store.openFolder(props.folder);
								store.viewedImages = undefined;
								props.onOpen();
							},
							props.folder
						);
					}}
				>
					{!itemEdit && props.folder.folder}
					{itemEdit && (
						<div className="item_edit_wrapper">
							<input
								ref={changeNameRef}
								className="item_edit"
								defaultValue={props.folder.folder}
								placeholder="section"
								autoFocus
							></input>
							<div
								className="trash_icon_wrapper"
								onClick={() => {
									store.deleteFolder(props.folder.folderId);
								}}
							>
								<TrashIcon></TrashIcon>
							</div>
							{store.sections && store.folders && (
								<div
									className="sections_list_wrapper"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="sections_list">
										<SectionList
											sections={store.sections
												?.map((s) => {
													return {
														...s,
														selected: false,
													};
												})
												.concat(
													(
														store.folders.find(
															(f) =>
																props.folder
																	.folderId ===
																f.folderId
														) ?? { sections: [] }
													).sections.map((s) => {
														return {
															...s,
															selected: true,
														};
													})
												)}
											toggleSection={(
												section: SectionWithInfoType
											) => {
												store.toggleSectionOnFolder(
													props.folder,
													section
												);
											}}
										></SectionList>
									</div>
								</div>
							)}
						</div>
					)}
				</span>
				<div className="subcategory_block flex_column">
					{props.folder.sections.map((section, index) => (
						<SectionItem
							section={section}
							small={true}
							key={index}
							onOpen={() => props.onOpen()}
						></SectionItem>
					))}
				</div>
			</div>
		</>
	);
}

export default observer(FolderItem);
