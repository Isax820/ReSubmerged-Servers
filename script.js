const serverGrid = document.getElementById("server-grid");
const regionCount = document.getElementById("region-count");
const onlineCount = document.getElementById("online-count");
const refreshButton = document.getElementById("refresh");


async function loadRegions() {

    try {

        serverGrid.innerHTML = `
            <div class="loading">
                🌊 Loading regions...
            </div>
        `;

        const response = await fetch("regions.json");

        if (!response.ok) {
            throw new Error("Could not load regions.json");
        }

        const data = await response.json();

        renderRegions(data.regions);

    } catch (error) {

        console.error(error);

        serverGrid.innerHTML = `
            <div class="server-card">
                <div class="server-name">
                    Unable to load regions
                </div>

                <p class="server-description">
                    Check that regions.json exists and is valid.
                </p>
            </div>
        `;
    }
}


function renderRegions(regions) {

    serverGrid.innerHTML = "";

    let onlineServers = 0;

    regions.forEach(region => {

        if (region.status === "online") {
            onlineServers++;
        }

        const card = document.createElement("article");

        card.className = "server-card";

        const isOnline = region.status === "online";

        card.innerHTML = `

            <div class="server-top">

                <div class="server-name">
                    ${escapeHtml(region.name)}
                </div>

                <div class="status ${isOnline ? "" : "offline"}">

                    <span class="status-dot"></span>

                    ${isOnline ? "Online" : "Offline"}

                </div>

            </div>


            <p class="server-description">

                ${escapeHtml(region.description)}

            </p>


            <div class="server-info">

                <span>
                    👥 ${region.players} / ${region.maxPlayers}
                </span>

                <span>
                    🌐 Region
                </span>

            </div>


            <div class="server-address">

                ${escapeHtml(region.address)}

            </div>


            <button
                class="copy-button"
                data-address="${escapeHtml(region.address)}"
            >
                📋 Copy address
            </button>
        `;


        const copyButton =
            card.querySelector(".copy-button");


        copyButton.addEventListener("click", async () => {

            const address =
                copyButton.dataset.address;

            try {

                await navigator.clipboard.writeText(address);

                copyButton.textContent =
                    "✓ Copied!";

                setTimeout(() => {

                    copyButton.textContent =
                        "📋 Copy address";

                }, 1500);

            } catch {

                copyButton.textContent =
                    "Copy failed";
            }
        });


        serverGrid.appendChild(card);
    });


    regionCount.textContent = regions.length;

    onlineCount.textContent = onlineServers;
}


/*
 * Prevent HTML injection when values
 * come from regions.json.
 */
function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/*
 * Refresh the region list.
 */
refreshButton.addEventListener("click", () => {

    refreshButton.textContent =
        "↻ Loading...";

    loadRegions().finally(() => {

        setTimeout(() => {

            refreshButton.textContent =
                "↻ Refresh";

        }, 300);
    });
});


/*
 * Initial load.
 */
loadRegions();