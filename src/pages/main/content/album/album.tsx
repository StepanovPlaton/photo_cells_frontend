import React, { useEffect, useRef, useState } from "react";

import "./album.scss";
import { ImageType } from "../../../../schemas/images";
import store from "../../../../store/store";
import { observer } from "mobx-react-lite";
import { SectionType } from "../../../../schemas/sections";
import authStore from "../../../../store/auth";
import TagsList from "../../../../components/tags_list/tags_list";
import { TagWithInfoType } from "../../../../schemas/tags";
import ImagesService from "../../../../services/images";
import TrashIcon from "../../../../components/icons/trach_icon";

function AlbumContent(props: { currentSections: SectionType[] }) {
	const [imageGrid, changeImageGrid] = useState<ImageType[][]>([]);
	const [coverImageGrid, changeCoverImageGrid] = useState<ImageType[][]>([]);
	const [coverImageGridInterval, changeCoverImageGridInterval] =
		useState<NodeJS.Timer>();
	const [modalOpened, changeModalOpened] = useState<boolean>(false);
	const [modalOpacity, changeModalOpacity] = useState<number>(0);
	const [viewedImage, changeViewedImage] = useState<ImageType>();

	const contentRef = useRef<HTMLDivElement>(null);
	const coverWrapperRef = useRef<HTMLDivElement>(null);
	const fileUploadInputRef = useRef<HTMLInputElement>(null);

	const [descriptionEdit, changeDescriptionEdit] = useState<boolean>(false);
	const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
	const [coverEdit, changeCoverEdit] = useState<boolean>(false);

	useEffect(() => {
		if (contentRef.current) {
			generateImageGrid(contentRef.current.offsetWidth);
			contentRef.current.scrollTop = 0;
		}
	}, [contentRef.current?.offsetWidth, store.viewedImages]);

	useEffect(() => {
		if (coverWrapperRef.current) {
			generateCoverImageGrid(coverWrapperRef.current.offsetWidth);
			coverWrapperRef.current.scrollTop = 0;
		}
	}, [coverWrapperRef.current?.offsetWidth, store.allImages]);

	const getCountOfColumns = (width: number) => {
		if (width <= 630) return 1;
		return 3;
	};

	const openImageInModal = (image: ImageType) => {
		changeModalOpened(true);
		changeViewedImage(image);
		setTimeout(() => changeModalOpacity(1), 250);
	};
	const closeModal = () => {
		changeModalOpacity(0);
		setTimeout(() => {
			changeModalOpened(false);
			changeViewedImage(undefined);
		}, 250);
	};

	const imagesToColumns = (images: ImageType[], countOfColumns: number) => {
		const columns: ImageType[][] = Array.apply(
			null,
			Array(countOfColumns)
		).map((e) => []);
		let heightOfColumns = Array(countOfColumns).fill(0);
		let currentColumn = 0;
		images
			.sort((a, b) => (a.priority <= b.priority ? 1 : -1))
			.forEach((image) => {
				const minHeightColumnIndex = heightOfColumns.indexOf(
					Math.min(...heightOfColumns)
				);
				columns[minHeightColumnIndex].push(image);
				heightOfColumns[minHeightColumnIndex] += 300; //image height
				currentColumn++;
				if (currentColumn >= countOfColumns) currentColumn = 0;
			});
		return columns;
	};

	const generateImageGrid = (width: number) => {
		let newImageGrid: ImageType[][] = [];
		changeImageGrid(newImageGrid);
		if (!store.viewedImages) return;
		newImageGrid = imagesToColumns(
			store.viewedImages,
			getCountOfColumns(width)
		);
		changeImageGrid(newImageGrid);
	};
	const generateCoverImageGrid = (width: number) => {
		let newImageGrid: ImageType[][] = [];
		changeCoverImageGrid(newImageGrid);
		if (!store.allImages) return;
		newImageGrid = imagesToColumns(
			store.allImages,
			getCountOfColumns(width)
		);
		changeCoverImageGrid(newImageGrid);
	};

	return (
		<>
			<div className="content" ref={contentRef}>
				{authStore.authorized && (
					<div className="add_wrapper">
						<div className="add_description">
							{props.currentSections[0].description === "0" &&
								!descriptionEdit &&
								props.currentSections[0].section !==
									"Overview" && (
									<span
										onClick={() => {
											changeDescriptionEdit(true);
											changeCoverEdit(false);
										}}
									>
										+ Add description
									</span>
								)}
						</div>
						<div className="add_cover">
							{!props.currentSections[0].cover &&
								props.currentSections[0].section !==
									"Overview" && (
									<span
										onClick={() => {
											changeCoverEdit(true);
											changeDescriptionEdit(false);
										}}
									>
										+ Add cover
									</span>
								)}
						</div>
						<div
							className="add_image"
							onClick={(e) => {
								fileUploadInputRef.current?.click();
							}}
						>
							+ Add image
							<input
								ref={fileUploadInputRef}
								className="hidden"
								type="file"
								accept=".jpg, .png, .jpeg"
								multiple
								onChange={(e) => {
									let files: FileList | null = e.target.files;
									if (!files) return;
									Array.from(files).forEach((f) => {
										store.addImage(f);
									});
								}}
							/>
						</div>
					</div>
				)}
				{props.currentSections &&
					props.currentSections.length === 1 &&
					(props.currentSections[0].description !== "0" ||
						props.currentSections[0].cover ||
						descriptionEdit ||
						coverEdit) && (
						<div className="cover_description_wrapper">
							{(props.currentSections[0].description !== "0" ||
								descriptionEdit) && (
								<div
									className="description"
									style={{
										width: props.currentSections[0].cover
											? "40%"
											: "100%",
										textAlign: props.currentSections[0]
											.cover
											? "right"
											: "center",
									}}
								>
									{!descriptionEdit && (
										<span
											onClick={() => {
												changeDescriptionEdit(true);
												changeCoverEdit(false);
											}}
										>
											{
												props.currentSections[0]
													.description
											}
										</span>
									)}
									{descriptionEdit && (
										<textarea
											onClick={() => {
												if (
													!descriptionInputRef.current
												)
													return;
												store.changeSection(
													props.currentSections[0]
														.sectionId,
													props.currentSections[0]
														.section,
													(descriptionInputRef.current
														.value as string) === ""
														? "0"
														: descriptionInputRef
																.current.value,
													props.currentSections[0]
														.coverId
												);

												changeDescriptionEdit(false);
											}}
											style={{
												textAlign: props
													.currentSections[0].cover
													? "right"
													: "center",
											}}
											ref={descriptionInputRef}
											className="description_input"
											defaultValue={
												props.currentSections[0]
													.description === "0"
													? ""
													: props.currentSections[0]
															.description
											}
											autoFocus
										></textarea>
									)}
								</div>
							)}
							{(props.currentSections[0].cover || coverEdit) && (
								<div
									className="cover"
									style={{
										width:
											props.currentSections[0]
												.description !== "0"
												? "60%"
												: "100%",
									}}
									ref={coverWrapperRef}
									onClick={() => {
										changeCoverEdit(true);
										changeDescriptionEdit(false);
									}}
								>
									{!coverEdit && (
										<img
											src={
												"api/static/images/full_size/" +
												props.currentSections[0].cover
											}
											alt=""
										></img>
									)}
									{coverEdit && coverImageGrid.length && (
										<div className="cover_edit">
											<div
												className="delete_cover"
												onClick={async (e) => {
													e.stopPropagation();
													await store.changeSection(
														props.currentSections[0]
															.sectionId,
														props.currentSections[0]
															.section,
														props.currentSections[0]
															.description,
														0
													);
													changeCoverEdit(false);
												}}
											>
												Delete cover
											</div>
											<div className="cover_grid">
												{coverImageGrid.map(
													(column, columnIndex) => (
														<div
															className="column"
															key={columnIndex}
														>
															{column.map(
																(
																	image,
																	cellIndex
																) => (
																	<div
																		className="cell"
																		key={
																			cellIndex
																		}
																		onClick={(
																			e
																		) => {
																			e.stopPropagation();
																			store.changeSection(
																				props
																					.currentSections[0]
																					.sectionId,
																				props
																					.currentSections[0]
																					.section,
																				props
																					.currentSections[0]
																					.description,
																				image.imageId
																			);
																			changeCoverEdit(
																				false
																			);
																		}}
																	>
																		<img
																			src={
																				"api/static/images/previews/" +
																				image.image
																			}
																			alt={
																				cellIndex +
																				""
																			}
																		/>
																	</div>
																)
															)}
														</div>
													)
												)}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					)}
				<div className="grid">
					{imageGrid.map((column, columnIndex) => (
						<div className="column" key={columnIndex}>
							{column.map((image, cellIndex) => (
								<div
									className="cell"
									key={cellIndex}
									onClick={async () => {
										openImageInModal(
											await ImagesService.getImage(
												image.imageId
											)
										);
									}}
								>
									<img
										src={
											"api/static/images/previews/" +
											image.image
										}
										alt={cellIndex + ""}
									/>
								</div>
							))}
						</div>
					))}
					{modalOpened && (
						<div
							className="image_view"
							style={{ opacity: modalOpacity }}
							onClick={() => closeModal()}
						>
							<div className="image_wrapper">
								{viewedImage && (
									<img
										src={
											"api/static/images/full_size/" +
											viewedImage.image
										}
										alt=""
									></img>
								)}
								{authStore.authorized &&
									store.tags &&
									viewedImage && (
										<div
											className="meta"
											onClick={(e) => e.stopPropagation()}
										>
											<TagsList
												tags={store.tags?.map((tag) => {
													return {
														...tag,
														selected:
															viewedImage.tags
																.map(
																	(t) =>
																		t.tagId
																)
																.includes(
																	tag.tagId
																),
													};
												})}
												toggleTag={async (
													tag: TagWithInfoType
												) => {
													const r =
														await store.toggleTagOnImage(
															viewedImage,
															tag
														);
													const addOrDelete =
														!viewedImage.tags
															.map((t) => t.tagId)
															.includes(
																tag.tagId
															);
													if (r) {
														if (addOrDelete)
															viewedImage.tags.push(
																tag
															);
														else
															viewedImage.tags =
																viewedImage.tags.filter(
																	(t) =>
																		t.tagId !==
																		tag.tagId
																);
													}
												}}
											></TagsList>
											<div className="priority_wrapper">
												<div
													className="block button"
													onClick={async () => {
														if (
															await store.changeImagePriority(
																viewedImage.imageId,
																viewedImage.priority -
																	1
															)
														) {
															viewedImage.priority--;
														}
													}}
												>
													-
												</div>
												<div className="block priority">
													{viewedImage.priority}
												</div>
												<div
													className="block button"
													onClick={async () => {
														if (
															await store.changeImagePriority(
																viewedImage.imageId,
																viewedImage.priority +
																	1
															)
														) {
															viewedImage.priority++;
														}
													}}
												>
													+
												</div>
											</div>
											<div
												className="trash_icon_wrapper"
												onClick={() => {
													store.deleteImage(
														viewedImage.imageId
													);
													changeViewedImage(
														undefined
													);
													changeModalOpened(false);
												}}
											>
												<TrashIcon></TrashIcon>
											</div>
										</div>
									)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default observer(AlbumContent);
