import { observer } from "mobx-react-lite";

import "./tags_list.scss";
import { TagWithInfoType } from "../../schemas/tags";
import { useRef, useState } from "react";
import TrashIcon from "../icons/trach_icon";
import store from "../../store/store";

function TagsList(props: {
	tags: TagWithInfoType[];
	toggleTag: (tag: TagWithInfoType) => void;
}) {
	const [toggleTagTimeout, changeToggleTagTimeout] =
		useState<NodeJS.Timeout>();
	const [tagEdit, changeTagEdit] = useState<number>(0);
	const [tagCreating, changeTagCreating] = useState<boolean>(false);

	const changeTagNameRef = useRef<HTMLInputElement>(null);
	const newTagNameRef = useRef<HTMLInputElement>(null);

	return (
		<div className="tag_list">
			{props.tags.map((tag, index) => (
				<div className="tag_wrapper" key={index}>
					<div
						className={"tag " + (tag.selected ? "active" : "")}
						onClick={(e) => {
							if (e.detail === 1) {
								if (tagEdit) {
									changeTagEdit(0);
									if (changeTagNameRef.current) {
										store.changeTagName(
											tagEdit,
											changeTagNameRef.current.value
										);
									}
									return;
								}
								clearTimeout(toggleTagTimeout);
								changeToggleTagTimeout(
									setTimeout(() => props.toggleTag(tag), 300)
								);
							}
							if (e.detail === 2) {
								clearTimeout(toggleTagTimeout);
								changeTagEdit(tag.tagId);
							}
						}}
					>
						{!(tagEdit === tag.tagId) && tag.tag}
						{tagEdit === tag.tagId && (
							<input
								ref={changeTagNameRef}
								className="tag_name"
								defaultValue={tag.tag}
								placeholder="tag"
								autoFocus
							></input>
						)}
					</div>
					<div
						className="trash_icon_wrapper"
						onClick={() => {
							store.deleteTag(tag.tagId);
						}}
					>
						<TrashIcon></TrashIcon>
					</div>
				</div>
			))}

			<div
				className="add_tag"
				onClick={() => {
					if (!tagCreating) changeTagCreating(true);
					else {
						if (newTagNameRef.current) {
							store.addNewTag(newTagNameRef.current.value);
							changeTagCreating(false);
						}
					}
				}}
			>
				{!tagCreating && "+"}
				{tagCreating && (
					<input
						ref={newTagNameRef}
						className="tag_name"
						defaultValue={"Tag"}
						placeholder="tag"
						autoFocus
					></input>
				)}
			</div>
		</div>
	);
}

export default observer(TagsList);
