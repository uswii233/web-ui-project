document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file-input");
    const itemsContainer = document.getElementById("items-container");
    const reviewedCount = document.getElementById("reviewed-count");
    const totalCount = document.getElementById("total-count");
    const submitBtn = document.getElementById("submit-btn");
    const thankYouMessage = document.getElementById("thank-you-message");

    let reviewedItems = [];

    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];

        if (file && file.type === "application/json") {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const items = JSON.parse(e.target.result);
                    totalCount.textContent = items.length;

                    itemsContainer.innerHTML = ''; // Clear previous content

                    items.forEach((item, index) => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "item";

                        const name = document.createElement("h3");
                        name.textContent = item.ai_name;

                        const description = document.createElement("textarea");
                        description.value = item.description;

                        const face = document.createElement("input");
                        face.type = "text";
                        face.value = item.face || "";

                        const deleteCheckbox = document.createElement("input");
                        deleteCheckbox.type = "checkbox";
                        deleteCheckbox.id = `delete-${index}`;
                        const deleteLabel = document.createElement("label");
                        deleteLabel.htmlFor = `delete-${index}`;
                        deleteLabel.textContent = "Delete";

                        itemDiv.appendChild(name);
                        itemDiv.appendChild(description);
                        itemDiv.appendChild(face);
                        itemDiv.appendChild(deleteCheckbox);
                        itemDiv.appendChild(deleteLabel);

                        itemsContainer.appendChild(itemDiv);

                        reviewedItems.push({
                            ai_name: item.ai_name,
                            description: description,
                            face: face,
                            delete: deleteCheckbox
                        });

                        description.addEventListener("input", updateCount);
                        face.addEventListener("input", updateCount);
                        deleteCheckbox.addEventListener("change", updateCount);
                    });

                    updateCount();
                    submitBtn.disabled = false; // Enable submit button after loading data

                } catch (error) {
                    alert("Error parsing JSON file: " + error.message);
                }
            };

            reader.readAsText(file);
        } else {
            alert("Please select a valid JSON file.");
        }
    });

    function updateCount() {
        let count = reviewedItems.filter(item => item.description.value || item.face.value || item.delete.checked).length;
        reviewedCount.textContent = count;
    }

    submitBtn.addEventListener("click", function() {
        let result = reviewedItems.map(item => ({
            ai_name: item.ai_name,
            description: item.description.value,
            face: item.face.value,
            delete: item.delete.checked
        }));

        console.log("Final Result: ", result);
        thankYouMessage.style.display = "block";
        // Implement logic to save the result on your end, like sending it to a server or saving to a file.
    });
});

