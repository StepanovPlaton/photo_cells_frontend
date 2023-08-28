import { observer } from "mobx-react-lite";

import "./add_folder.scss";
import authStore from "../../../../store/auth";
import { useRef, useState } from "react";
import store from "../../../../store/store";

function AddFolder() {
	const [addFolder, changeAddFolder] = useState<boolean>(false);
	const [newFolderName, changeNewFolderName] = useState<string>();
	const newFolderNameRef = useRef<HTMLInputElement>(null);
	return (
		<div className="add_folder_wrapper">
			{authStore.authorized && (
				<>
					{!addFolder && (
						<div
							className="folder_add_wrapper"
							onClick={() => changeAddFolder(true)}
						>
							+ Add folder
						</div>
					)}
					{addFolder && (
						<input
							onClick={() => {
								if (
									newFolderNameRef &&
									newFolderNameRef.current
								) {
									store.addFolder(
										newFolderNameRef.current.value
									);
									changeAddFolder(false);
								}
							}}
							ref={newFolderNameRef}
							className="new_folder"
							autoFocus
							defaultValue={"New folder name"}
						/>
					)}
				</>
			)}
		</div>
	);
}

export default observer(AddFolder);
