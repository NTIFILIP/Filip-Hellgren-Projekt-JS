const clickerButton = document.querySelector(".clicker");
const clickCounter = document.querySelector(".click-counter");
const autoClickCounter = document.querySelector(".auto-click-counter");
const upgradeList = document.querySelector(".shop-area");
const clickerBackground = document.querySelector(".click-area");
const resetButton = document.querySelector(".reset-button");

clicks = parseInt(localStorage.getItem("clicks")) || 0;
clicksPerSecond = 0;
clicksPerClick = 1;

backgroundExtended = true;
backgroundStartSize = 80;
backgroundEndSize = 150;
backgroundUpdateTime = 5000;

upgradeButtons = new Array();

canPurchaseColor = "rgb(166, 228, 41)";
notEnoughClickColor = "rgb(228, 69, 41)";

const upgrades = {
  ["Command Line"]: {
    owned: parseInt(localStorage.getItem("Command Line")) || 0,
    cpsIncrease: 1,
    cost: 50,
  },
  ["HTML"]: {
    owned: parseInt(localStorage.getItem("HTML")) || 0,
    cpsIncrease: 5,
    cost: 150,
  },
  ["CSS"]: {
    owned: parseInt(localStorage.getItem("CSS")) || 0,
    cpsIncrease: 15,
    cost: 1000,
  },
  ["Javascript"]: {
    owned: parseInt(localStorage.getItem("Javascript")) || 0,
    cpsIncrease: 40,
    cost: 2200,
  },
  ["Python"]: {
    owned: parseInt(localStorage.getItem("Python")) || 0,
    cpsIncrease: 100,
    cost: 12000,
  },
  ["CSharp"]: {
    owned: parseInt(localStorage.getItem("CSharp")) || 0,
    cpsIncrease: 250,
    cost: 25000,
  },
  ["Lua"]: {
    owned: parseInt(localStorage.getItem("Lua")) || 0,
    cpsIncrease: 400,
    cost: 100000,
  },
};

function TryPurchase(event) {
  parent = event.target.parentElement;
  upgradeName = parent.id.replaceAll("-", " ");
  upgradeData = upgrades[upgradeName];
  cost = CalculateCost(upgradeData.cost, upgradeData.owned);
  if (upgradeData !== null) {
    if (clicks >= cost) {
      upgradeData.owned += 1;
      clicks -= cost;
      localStorage.setItem(upgradeName, upgradeData.owned);
      localStorage.setItem("clicks", clicks);
      UpdatePage();
    }
  }
}

function CreateUpgradeObject() {
  let newUpgradeObject = document.createElement("div");
  newUpgradeObject.classList.add("upgrade-object");

  let ownedAmount = document.createElement("p");
  ownedAmount.classList.add("owned-amount");

  let upgradeNameLabel = document.createElement("p");
  upgradeNameLabel.classList.add("upgrade-name-label");

  let upgradeCostLabel = document.createElement("p");
  upgradeCostLabel.classList.add("upgrade-cost-label");

  let upgradeButton = document.createElement("button");
  upgradeButton.classList.add("upgrade-button");
  upgradeButton.addEventListener("click", TryPurchase);

  newUpgradeObject.appendChild(ownedAmount);
  newUpgradeObject.appendChild(upgradeNameLabel);
  newUpgradeObject.appendChild(upgradeCostLabel);
  newUpgradeObject.appendChild(upgradeButton);

  upgradeList.appendChild(newUpgradeObject);

  return newUpgradeObject;
}

function CalculateCost(cost, owned) {
  return Math.round(cost * Math.pow(1.05, owned));
}

function DisplayUpgrades() {
  let totalCps = 0;

  for (const [upgradeName, upgradeData] of Object.entries(upgrades)) {
    let id = upgradeName.replaceAll(" ", "-");
    let upgradeObject =
      upgradeList.querySelector("#" + id) ||
      CreateUpgradeObject(upgradeName, upgradeData);
    upgradeObject.id = id;

    let ownedAmountLabel = upgradeObject.querySelector(".owned-amount");
    ownedAmountLabel.innerHTML = upgradeData.owned;

    let upgradeNameLabel = upgradeObject.querySelector(".upgrade-name-label");
    upgradeNameLabel.innerHTML = upgradeName;

    let cost = CalculateCost(upgradeData.cost, upgradeData.owned);

    let upgradeCostLabel = upgradeObject.querySelector(".upgrade-cost-label");
    upgradeCostLabel.innerHTML = cost + " Hacks";

    let upgradeButton = upgradeObject.querySelector(".upgrade-button");
    if (clicks >= cost) {
      upgradeButton.style.backgroundColor = canPurchaseColor;
      upgradeButton.innerHTML = "Purchase";
    } else {
      upgradeButton.style.backgroundColor = notEnoughClickColor;
      upgradeButton.innerHTML = "Not enough hacks!";
    }

    totalCps += upgradeData.owned * upgradeData.cpsIncrease;
  }

  clicksPerSecond = totalCps;
}

function DisplayStats() {
  clickCounter.innerHTML = "Hacks : " + clicks;
  autoClickCounter.innerHTML = "Auto Hacks per Second : " + clicksPerSecond;
}

function UpdatePage() {
  DisplayUpgrades();
  DisplayStats();
}

function Clicker() {
  clicks += clicksPerClick;
  localStorage.setItem("clicks", clicks);
  UpdatePage();
}

UpdatePage();
clickerButton.addEventListener("click", Clicker);

function ResetData() {
  localStorage.clear();
  clicks = 0;
  clicksPerSecond = 0;
  localStorage.setItem("clicks", 0);
  for (const [, upgradeData] of Object.entries(upgrades)) {
    upgradeData.owned = 0;
  }
  UpdatePage();
}

resetButton.addEventListener("click", ResetData);

function AutoClick() {
  clicks += clicksPerSecond;
  localStorage.setItem("clicks", clicks);
  UpdatePage();
}

function UpdateBackground() {
  let newSize = backgroundStartSize;
  if (backgroundExtended) {
    newSize = backgroundEndSize;
  }

  clickerBackground.style.transitionDuration = backgroundUpdateTime + "ms";
  clickerBackground.style.backgroundSize = newSize + "%";

  backgroundExtended = !backgroundExtended;
}

UpdateBackground();
setInterval(UpdateBackground, backgroundUpdateTime);
setInterval(AutoClick, 1000);
