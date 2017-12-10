let modifyTimelineChild = function(timelineChildNode) {
   const impoliteText = "requested changes to this revision.";
   const politeText = "politely requested changes to this revision.";
   const impoliteColor = "phui-timeline-icon-fill-red";
   const politeColor = "phui-timeline-icon-fill-orange";
   const phabricatorText = "This revision now requires changes to proceed.";

   let innerHTML = timelineChildNode.innerHTML;

   let isReviewerRequestedChanges = innerHTML.indexOf(impoliteText) >= 0;
   let isPhabricatorRequestedChanges = innerHTML.indexOf(phabricatorText) >= 0;

   if (isReviewerRequestedChanges) {
      let isAlreadyProcessed = innerHTML.indexOf(politeText) >= 0;
      if (isAlreadyProcessed) {
         return;
      }

      let modifiedInnerHTML = innerHTML.replace(impoliteText, politeText);
      if (modifiedInnerHTML === innerHTML) {
         return;
      }

      timelineChildNode.innerHTML = modifiedInnerHTML.replace(impoliteColor, politeColor);
   } else if (isPhabricatorRequestedChanges) {
      if (timelineChildNode.children.length != 1) {
         return;
      }

      let timelineEventViewNode = timelineChildNode.children[0];
      if (timelineEventViewNode.children.length != 1) {
         return;
      }

      let timelineContentNode = timelineEventViewNode.children[0];
      for (let node of Array.from(timelineContentNode.children)) {
         let classList = node.classList;
         if (classList.contains("phui-timeline-image") || classList.contains("phui-timeline-wedge")) {
            node.remove();
         }
      }
   }
};

let modifyTimelines = function(timelines) {
   let mutationObserverConfig = {
      childList: true
   };
   let mutationObserverCallback = function(mutationsList) {
      for (let mutation of mutationsList) {
         for (let addedNode of mutation.addedNodes) {
            modifyTimelineChild(addedNode);
         }
      }
   };

   for (let timeline of timelines) {
      for (let timelineChildNode of timeline.children) {
         modifyTimelineChild(timelineChildNode);
      }

      let mutationObserver = new MutationObserver(mutationObserverCallback);
      mutationObserver.observe(timeline, mutationObserverConfig);
   }
};

let modifyReviewersSection = function() {
   const impoliteReviewersColor = "red";
   const politeReviewersColor = "orange";

   let statusItemNodes = document.getElementsByClassName("phui-status-item-target");
   for (let statusItemNode of statusItemNodes) {
      let isReviewerNode = !!statusItemNode.querySelector("[data-sigil='hovercard']");
      if (!isReviewerNode) {
         continue;
      }

      let iconNodes = Array.from(statusItemNode.getElementsByClassName("fa-times-circle " + impoliteReviewersColor));
      for (let iconNode of iconNodes) {
         iconNode.classList.replace(impoliteReviewersColor, politeReviewersColor);
      }
   }
};

var modifyDifferentialDocument = function() {
   let timelines = document.getElementsByClassName("phui-timeline-view");
   
   let isPhabricator = timelines.length > 0;
   if (!isPhabricator) {
      return;
   }

   modifyReviewersSection();
   modifyTimelines(timelines);
};
