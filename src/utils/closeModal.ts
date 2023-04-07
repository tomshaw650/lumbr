const closeModal = () => {
  const openModal: HTMLInputElement = document.querySelector(
    ".modal-toggle:checked"
  )!;
  if (openModal) {
    openModal.checked = false;
  }
};

export default closeModal;
