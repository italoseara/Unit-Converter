function alert(message) {
  const toast = document.querySelector(".toast");
  toast.querySelector(".toast-body").textContent = message;
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toastBootstrap.show();
}

function toPhotonFluxDensity(value, unit) {
  // https://www.gemini.edu/observing/resources/itc/itc-help
  // Photon flux density is measured in photons/s/nm/m^2

  // lambda is the wavelength in nm. This is equivalent to the formal definition in Oke & Gunn (1983. ApJ, 266, 713).
  // https://articles.adsabs.harvard.edu/pdf/1983ApJ...266..713O
  // https://en.wikipedia.org/wiki/Photometric_system
  const lambda = 551e-9; // 551 nm (V-band)

  switch (unit) {
    case "mag":
      // TODO: Ask professor about this
      throw new Error("Not implemented");
    case "AB mag":
      return (5.632e10 / lambda) * Math.pow(10, -0.4 * value);
    case "Jy":
      return value * (1.509e7 / lambda);
    case "W/m^2/um":
      return value * (lambda / 1.988e-13);
    case "ergs/s/cm^2/Angstrom":
      return value * (lambda / 1.988e-14);
    case "ergs/s/cm^2/Hz":
      return value * (1.509e30 / lambda);
    default:
      throw new Error("Invalid unit");
  }
}

function fromPhotonFluxDensity(value, unit) {
  const lambda = 551e-9; // 551 nm (V-band)

  switch (unit) {
    case "mag":
      throw new Error("Not implemented");
    case "AB mag":
      return -2.5 * Math.log10(value / (5.632e10 / lambda));
    case "Jy":
      return value / (1.509e7 / lambda);
    case "W/m^2/um":
      return value / (lambda / 1.988e-13);
    case "ergs/s/cm^2/Angstrom":
      return value / (lambda / 1.988e-14);
    case "ergs/s/cm^2/Hz":
      return value / (1.509e30 / lambda);
    default:
      throw new Error("Invalid unit");
  }
}

function update(element) {
  const id = element.id;
  const input = document.querySelector(`#${id} input`);
  const select = document.querySelector(`#${id} select`);

  const other = document.querySelector(`.unit-input:not(#${id})`);
  const otherInput = other.querySelector("input");
  const otherSelect = other.querySelector("select");

  const value = parseFloat(input.value) || 0;
  const unit = select.value;
  const otherUnit = otherSelect.value;

  const result = toPhotonFluxDensity(value, unit);
  const otherValue = fromPhotonFluxDensity(result, otherUnit);

  otherInput.value = otherValue;

  alert(`${value} ${unit} = ${result} photons/s/nm/m^2`);
}

document.querySelectorAll(".unit-input input").forEach((input) => {
  input.addEventListener("input", (e) => update(e.target.parentElement));
});

document.querySelectorAll(".unit-input select").forEach((select) => {
  select.addEventListener("change", (e) => {
    // Update based on the other input
    const id = e.target.parentElement.id;
    const other = document.querySelector(`.unit-input:not(#${id})`);
    update(other);
  });
});
