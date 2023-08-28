import React, { useEffect, useRef, useState } from "react";

import "./section_item.scss";
import { SectionType, isSections } from "../../../../schemas/sections";
import store from "../../../../store/store";
import TagsList from "../../../../components/tags_list/tags_list";
import { TagWithInfoType } from "../../../../schemas/tags";
import authStore from "../../../../store/auth";
import { observer } from "mobx-react-lite";
import TrashIcon from "../../../../components/icons/trach_icon";

function SectionItem(props: {
	section: SectionType;
	small?: boolean;
	onOpen: () => void;
}) {
	const [itemEdit, changeItemEdit] = useState<boolean>();
	const changeNameRef = useRef<HTMLInputElement>(null);
	const [doubleClickTimeout, changeDoubleClickTimeout] =
		useState<NodeJS.Timeout>();
	const clickHandler = (e: any, open: () => void, section: SectionType) => {
		e.stopPropagation();
		if (e.detail === 1) {
			if (itemEdit) {
				changeItemEdit(false);
				if (changeNameRef && changeNameRef.current) {
					if (changeNameRef.current) {
						store.changeSection(
							section.sectionId,
							changeNameRef.current.value,
							section.description,
							section.coverId
						);
					}
				}

				return;
			}
			clearTimeout(doubleClickTimeout);
			changeDoubleClickTimeout(setTimeout(() => open(), 300));
		}
		if (e.detail === 2) {
			console.log("open", authStore.authorized);
			clearTimeout(doubleClickTimeout);
			open();
			if (authStore.authorized) changeItemEdit(true);
		}
	};

	return (
		<>
			<div
				className={
					(props.small ? "subcategory" : "category") +
					" stand_alone " +
					(Array.isArray(store.currentContent) &&
					isSections(store.currentContent) &&
					store.currentContent
						.map((c) => c.sectionId)
						.includes(props.section.sectionId) &&
					store.currentContent.length === 1
						? "active"
						: "")
				}
				onClick={(e) => {
					clickHandler(
						e,
						() => {
							store.openSection(props.section);
							store.viewedImages = undefined;
							props.onOpen();
						},
						props.section
					);
				}}
			>
				{!itemEdit && props.section.section}
				{itemEdit && (
					<div className="item_edit_wrapper">
						<input
							ref={changeNameRef}
							className="item_edit"
							defaultValue={props.section.section}
							placeholder="section"
							autoFocus
						></input>
						<div
							className="trash_icon_wrapper"
							onClick={() => {
								store.deleteSection(props.section.sectionId);
							}}
						>
							<TrashIcon></TrashIcon>
						</div>
						{store.tags && (
							<div
								className="tags_list_wrapper"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="tags_list">
									<TagsList
										tags={store.tags.map((tag) => {
											return {
												...tag,
												selected: props.section.tags
													.map((t) => t.tagId)
													.includes(tag.tagId),
											};
										})}
										toggleTag={(tag: TagWithInfoType) => {
											store.toggleTagOnSection(
												props.section,
												tag
											);
										}}
									></TagsList>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}

export default observer(SectionItem);
