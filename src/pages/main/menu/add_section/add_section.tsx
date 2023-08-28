import { observer } from "mobx-react-lite";

import "./add_section.scss";
import authStore from "../../../../store/auth";
import { useRef, useState } from "react";
import store from "../../../../store/store";

function AddSection() {
	const [addSection, changeAddSection] = useState<boolean>(false);
	const [newSectionName, changeNewSectionName] = useState<string>();
	const newSectionNameRef = useRef<HTMLInputElement>(null);
	return (
		<div className="add_section_wrapper">
			{authStore.authorized && (
				<>
					{!addSection && (
						<div
							className="section_add_wrapper"
							onClick={() => changeAddSection(true)}
						>
							+ Add section
						</div>
					)}
					{addSection && (
						<input
							onClick={() => {
								if (
									newSectionNameRef &&
									newSectionNameRef.current
								) {
									store.addSection(
										newSectionNameRef.current.value
									);
									changeAddSection(false);
								}
							}}
							ref={newSectionNameRef}
							className="new_section"
							autoFocus
							defaultValue={"New section name"}
						/>
					)}
				</>
			)}
		</div>
	);
}

export default observer(AddSection);
