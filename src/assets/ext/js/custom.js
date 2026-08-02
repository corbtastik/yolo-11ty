/**
 * Custom JavaScript sample that makes AJAX and Fetch requests.
 **/
(function() {
    'use strict';

    /**
     * Create an unordered list for the Site Info (site.json) data.
     */
    function createView(siteInfo, targetId, buttonId) {
        var existing = document.getElementById(targetId);
        if (existing) {
            existing.remove();
        }

        var ulElement = document.createElement("ul");
        ulElement.setAttribute("id", targetId);

        var button = document.getElementById(buttonId);
        if (button) {
            button.after(ulElement);
        }

        var items = [
            "Retrieved at: " + new Date().toLocaleString(),
            "Name: " + siteInfo.name,
            "Title: " + siteInfo.title,
            "Description: " + siteInfo.description,
            "Version: " + siteInfo.version,
            "Brand Theme: " + siteInfo.brand.theme,
            "Brand Syntax: " + siteInfo.brand.syntax,
            "Build Date: " + siteInfo.buildDate
        ];

        items.forEach(function(text) {
            var li = document.createElement("li");
            li.textContent = text;
            ulElement.appendChild(li);
        });
    }

    /**
     * Handle AJAX button click using XMLHttpRequest
     */
    function onAjaxClick() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/site.json", true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                createView(data, "site-info-ajax", "site-button-ajax");
            } else {
                console.error("AJAX request failed:", xhr.status);
            }
        };
        xhr.onerror = function() {
            console.error("AJAX request error");
        };
        xhr.send();
    }

    /**
     * Handle Fetch button click using Fetch API
     */
    function onFetchClick() {
        fetch("/site.json")
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Fetch failed: " + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                createView(data, "site-info-fetch", "site-button-fetch");
            })
            .catch(function(error) {
                console.error("Fetch error:", error);
            });
    }

    /**
     * Initialize event listeners
     */
    function init() {
        var ajaxButton = document.getElementById("site-button-ajax");
        var fetchButton = document.getElementById("site-button-fetch");

        if (ajaxButton) {
            ajaxButton.addEventListener("click", onAjaxClick);
        }
        if (fetchButton) {
            fetchButton.addEventListener("click", onFetchClick);
        }
    }

    YoloUtils.domReady(init);
})();
