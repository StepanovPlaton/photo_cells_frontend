import { observer } from "mobx-react-lite";

import "./section_list.scss";
import { useRef, useState } from "react";
import TrashIcon from "../icons/trach_icon";
import store from "../../store/store";
import { SectionWithInfoType } from "../../schemas/sections";

function SectionList(props: {
	sections: SectionWithInfoType[];
	toggleSection: (tag: SectionWithInfoType) => void;
}) {
	return (
		<div className="section_list">
			{props.sections.map((section, index) => (
				<div className="section_wrapper" key={index}>
					<div
						className={
							"section " + (section.selected ? "active" : "")
						}
						onClick={() => {
							props.toggleSection(section);
						}}
					>
						{section.section}
					</div>
				</div>
			))}
		</div>
	);
}

export default observer(SectionList);
