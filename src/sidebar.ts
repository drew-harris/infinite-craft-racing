export const hideSidebar = () => {
  let elements = document.getElementsByClassName(
    "items",
  ) as HTMLCollectionOf<HTMLDivElement>;
  console.log("elel elgn", elements.length);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
  elements = document.getElementsByClassName(
    "sidebar-controls",
  ) as HTMLCollectionOf<HTMLDivElement>;
  console.log("elel elgn", elements.length);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
};

export const showSidebar = () => {
  let elements = document.getElementsByClassName(
    "items",
  ) as HTMLCollectionOf<HTMLDivElement>;
  console.log("elel elgn", elements.length);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "block";
  }
  elements = document.getElementsByClassName(
    "sidebar-controls",
  ) as HTMLCollectionOf<HTMLDivElement>;
  console.log("elel elgn", elements.length);
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "block";
  }
};
