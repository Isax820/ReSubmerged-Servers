document.addEventListener("DOMContentLoaded", () => {

    const serverGrid = document.querySelector(".server-grid");

    if (!serverGrid) {
        console.error("Server grid not found.");
        return;
    }

    loadRegions();


    async function loadRegions() {

        try {

            const response = await fetch("regions.json");

            if (!response.ok) {
                throw new Error("Unable to load regions.json");
            }

            const regions = await response.json();

            serverGrid.innerHTML = "";

            regions.forEach(region => {
                serverGrid.appendChild(createServerCard(region));
            });

        } catch (error) {

            console.error(error);

            serverGrid.innerHTML = `
                <div class="server-card">
                    <h3>Unable to load regions</h3>
                    <p class="server-address">
                        Please try again later.
                    </p>
                </div>
            `;
        }
    }


    function createServerCard(region) {

        const card = document.createElement("article");

        card.className = "server-card";

        if (region.status === "offline") {
            card.classList.add("offline-card");
        }

        const isOnline = region.status === "online";

        card.innerHTML = `
            <div class="server-header">

                <div>
                    <span class="status ${isOnline ? "online" : "offline"}"></span>

                    <span class="status-text">
                        ${isOnline ? "ONLINE" : "OFFLINE"}
                    </span>
                </div>

                <span class="server-region">
                    ${escapeHTML(region.code)}
                </span>

            </div>


            <h3>
                ${escapeHTML(region.name)}
            </h3>


            <p class="server-address">
                ${escapeHTML(region.address)}
            </p>


            <div class="server-info">

                <div>
                    <span>Players</span>

                    <strong>
                        ${isOnline ? region.players : "—"}
                    </strong>
                </div>


                <div>
                    <span>Ping</span>

                    <strong>
                        ${isOnline ? `${region.ping} ms` : "—"}
                    </strong>
                </div>

            </div>


            <button
                class="copy-button"
                ${isOnline ? "" : "disabled"}
            >
                ${isOnline ? "📋 Copy address" : "Server offline"}
            </button>
        `;


        const copyButton = card.querySelector(".copy-button");

        if (isOnline) {

            copyButton.addEventListener("click", async () => {

                try {

                    await navigator.clipboard.writeText(
                        region.address
                    );

                    const originalText = copyButton.textContent;

                    copyButton.textContent = "✓ Copied!";

                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 1500);

                } catch (error) {

                    console.error(
                        "Unable to copy address:",
                        error
                    );

                    copyButton.textContent = "Copy failed";

                    setTimeout(() => {
                        copyButton.textContent = "📋 Copy address";
                    }, 1500);
                }
            });
        }

        return card;
    }


    function escapeHTML(value) {

        const element = document.createElement("div");

        element.textContent = value ?? "";

        return element.innerHTML;
    }

});
