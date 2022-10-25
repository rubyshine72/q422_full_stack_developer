(function () {
  // Confirm Buttons
  const btnsConfirm = document.querySelectorAll(".confirm");

  // Confirm button click event function
  const confirmClick = async (e) => {
    const questionText = e.target.getAttribute("message");

    const dialog = new ConfirmDialog({ questionText });
    const result = await dialog.confirm();
    if (result) {
      document.querySelector(".confirm-result").textContent =
        "You just clicked “yes”";
    } else {
      document.querySelector(".confirm-result").textContent =
        "You just clicked “Cancel”";
    }
  };

  // Bind click events to confirm buttons
  for (const button of btnsConfirm) {
    button.addEventListener("click", async (e) => {
      await confirmClick(e);
    });
  }

  // Confirm class object
  class ConfirmDialog {
    constructor({ questionText, parent }) {
      this.questionText = questionText || "Are you sure?";
      this.parent = parent || document.body;

      this.dialog = undefined;
      this.trueButton = undefined;
      this.falseButton = undefined;

      this._createDialog();
      this._appendDialog();
    }

    confirm() {
      return new Promise((resolve, reject) => {
        const somethingWentWrongUponCreation =
          !this.dialog || !this.trueButton || !this.falseButton;
        if (somethingWentWrongUponCreation) {
          reject("Someting went wrong when creating the modal");
          return;
        }

        this.dialog.classList.remove("hidden");
        this.trueButton.focus();

        this.trueButton.addEventListener("click", () => {
          resolve(true);
          this._destroy();
        });

        this.falseButton.addEventListener("click", () => {
          resolve(false);
          this._destroy();
        });
      });
    }

    _createDialog() {
      this.dialog = document.createElement("div");
      this.dialog.classList.add("hidden");
      this.dialog.classList.add("confirm-dialog");

      const dialogBackdrop = document.createElement("div");
      dialogBackdrop.classList.add("dialog-backdrop");
      this.dialog.appendChild(dialogBackdrop);

      const dialogContent = document.createElement("div");
      dialogContent.classList.add("dialog-content");

      const question = document.createElement("div");
      question.textContent = this.questionText;
      question.classList.add("dialog-question");
      dialogContent.appendChild(question);

      const buttonGroup = document.createElement("div");
      buttonGroup.classList.add("dialog-button-group");
      dialogContent.appendChild(buttonGroup);

      this.trueButton = document.createElement("button");
      this.trueButton.classList.add("dialog-button", "dialog-button--true");
      this.trueButton.type = "button";
      this.trueButton.textContent = "Yes";
      buttonGroup.appendChild(this.trueButton);

      this.falseButton = document.createElement("button");
      this.falseButton.classList.add("dialog-button", "dialog-button--false");
      this.falseButton.type = "button";
      this.falseButton.textContent = "Cancel";
      buttonGroup.appendChild(this.falseButton);

      this.dialog.appendChild(dialogContent);
    }

    _appendDialog() {
      this.parent.appendChild(this.dialog);
    }

    _destroy() {
      this.dialog.classList.add("disapearing");
      setTimeout(() => {
        this.parent.removeChild(this.dialog);
        delete this;
      }, 600);
    }
  }
})();
