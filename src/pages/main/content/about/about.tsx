import { observer } from "mobx-react-lite";
import React from "react";

import "./about.scss";
import { AboutType } from "../../../../schemas/about";

function About(props: { about: AboutType }) {
	return (
		<div className="content">
			{props.about && (
				<div className="avatar_about_wrapper">
					{props.about.avatar && (
						<div className="avatar">
							<img
								src={
									"api/static/images/full_size/" +
									props.about.avatar
								}
								alt=""
							></img>
						</div>
					)}
					{props.about.aboutMe && (
						<div
							className="about"
							dangerouslySetInnerHTML={{
								__html: props.about.aboutMe.replaceAll(
									"\n",
									"<br />"
								),
							}}
						></div>
					)}
				</div>
			)}
		</div>
	);
}

export default observer(About);
