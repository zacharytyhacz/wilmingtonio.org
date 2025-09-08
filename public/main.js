document.addEventListener("DOMContentLoaded", () => {
	//#region WE ARE - WORD ROLL
	const wordRoll = document.querySelector(".word-roll");

	// Dynamically create the keyframes
	function createDynamicKeyframes(numItems) {
		const animationName = "roll-words";
		const styleId = "dynamic-keyframes-style";
		const intervalPerItem = 1.2;

		wordRoll.style.setProperty(
			"--animation-duration",
			`${(intervalPerItem * numItems).toFixed(2)}s`
		);

		let keyframesString = `@keyframes ${animationName} {\n`;
		const singleWordHeight = 39; // Match the height + margin from CSS

		for (let i = 0; i < numItems; i++) {
			const startPercent = (i / numItems) * 100;
			const endPercent = ((i + 1) / numItems) * 100;

			const transformValue = `translateY(-${i * singleWordHeight}px)`;

			keyframesString += `  ${startPercent.toFixed(2)}% {\n`;
			keyframesString += `    transform: ${transformValue};\n`;
			keyframesString += `  }\n`;

			// Add a slight pause at the end of each word's display
			keyframesString += `  ${(
				startPercent +
				(endPercent - startPercent) * 0.8
			).toFixed(2)}% {\n`;
			keyframesString += `    transform: ${transformValue};\n`;
			keyframesString += `  }\n`;
		}

		keyframesString += `  100% {\n`;
		keyframesString += `    transform: translateY(0);\n`;
		keyframesString += `  }\n`;

		keyframesString += `}`;

		// Remove old style tag if it exists
		const oldStyle = document.getElementById(styleId);
		if (oldStyle) {
			oldStyle.remove();
		}

		// Create and inject the new style tag
		const style = document.createElement("style");
		style.id = styleId;
		style.textContent = keyframesString;
		document.head.appendChild(style);
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	fetch("words.json")
		.then((response) => response.json())
		.then((words) => {
			shuffleArray(words).forEach((word) => {
				const span = document.createElement("span");
				span.textContent = word;
				wordRoll.appendChild(span);
			});

			// Add one to account for initial Wilmington IO
			createDynamicKeyframes(words.length + 1);
		})
		.catch((error) => {
			console.error("Error fetching socials:", error);
		});
	//#endregion
	//#region SOCIAL LINKS
	const socialsList = document.getElementById("socials");

	fetch("socials.json")
		.then((response) => response.json())
		.then((socials) => {
			socials.forEach((social) => {
				// Create the anchor element
				const socialLink = document.createElement("a");
				socialLink.target = "_blank";
				socialLink.rel = "noopener noreferrer";
				socialLink.href = social.url;
				socialLink.title = social.title;

				// Fetch the SVG file content as text
				fetch(`./images/${social.iconName}`)
					.then((response) => response.text())
					.then((svgContent) => {
						// Create a span for the text
						const spanText = document.createElement("span");
						spanText.textContent = social.text;

						// Insert the SVG string as HTML inside the anchor tag
						socialLink.innerHTML = svgContent;

						// Append the span text after the SVG
						socialLink.appendChild(spanText);

						// Append the complete social link to the list
						socialsList.appendChild(socialLink);
					})
					.catch((error) => {
						console.error("Error fetching SVG:", error);
					});
			});
		})
		.catch((error) => {
			console.error("Error fetching socials:", error);
		});
	//#endregion
	//#region IMAGES
	const imageList = document.getElementById("image-list");

	const modal = document.getElementById("image-modal");
	const modalImg = document.getElementById("modal-image");

	function openModal(imageSrc) {
		modal.style.display = "flex";
		modalImg.src = imageSrc;
	}

	fetch("images.json")
		.then((response) => response.json())
		.then((images) => {
			images.forEach((image) => {
				const imageElement = document.createElement("img");
				imageElement.src = `./images/${image.filename}`;
				imageElement.alt = image.alt;
				image.width = "256";
				imageElement.addEventListener("click", () => {
					openModal(imageElement.src);
				});
				imageList.appendChild(imageElement);
			});
		})
		.catch((error) => {
			console.error("Error fetching images:", error);
		});

	const closeBtn = document.querySelector(".close-btn");
	if (closeBtn) {
		closeBtn.addEventListener("click", () => {
			if (modal) {
				modal.style.display = "none";
			}
		});
	}
	//#endregion
	//#region EVENTS
	const formatDateTimeRange = (start, end) => {
		// Your existing formatting logic
		const options = {
			month: "long",
			day: "numeric",
		};
		const startTime = start
			.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			})
			.replace(":00", "")
			.toLowerCase();
		const endTime = end
			.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			})
			.replace(":00", "")
			.toLowerCase();
		const startDate = start.toLocaleDateString("en-US", options);
		const endDate = end.toLocaleDateString("en-US", options);

		if (startDate === endDate) {
			return `${startDate} @ ${startTime} - ${endTime}`;
		} else {
			return `${startDate} @ ${startTime} - ${endDate} @ ${endTime}`;
		}
	};

	const eventsList = document.getElementById("events-list");
	const now = new Date();

	fetch("events.json")
		.then((response) => response.json())
		.then((events) => {
			events = events.map((event) => ({
				...event,
				datetimeStart: new Date(event.datetimeStart),
				datetimeEnd: new Date(event.datetimeEnd),
			}));
			events = events.sort((a, b) => a.datetimeStart - b.datetimeStart);
			events.forEach((event) => {
				// Check if the event's end date is in the future
				if (event.datetimeEnd > now) {
					// Create the anchor element
					const eventLink = document.createElement("a");
					eventLink.href = event.link;
					eventLink.target = "_blank"; // Open link in new tab
					if (event.highlight) {
						eventLink.classList.add("highlight");
					}

					// Create and append child elements
					const title = document.createElement("h3");
					title.textContent = event.title;
					eventLink.appendChild(title);

					const formattedDate = document.createElement("h4");
					formattedDate.textContent = formatDateTimeRange(
						event.datetimeStart,
						event.datetimeEnd
					);
					eventLink.appendChild(formattedDate);

					const location = document.createElement("h5");
					location.textContent = event.location;
					eventLink.appendChild(location);

					const address = document.createElement("h5");
					address.textContent = event.address;
					eventLink.appendChild(address);

					const registerButton = document.createElement("button");
					registerButton.type = "button";
					registerButton.textContent = "REGISTER";
					eventLink.appendChild(registerButton);

					// Append the complete event to the events-list div
					eventsList.appendChild(eventLink);
				}
			});
		})
		.catch((error) => {
			console.error("Error fetching events:", error);
		});
	//#endregion
});
