const { ethers } = require("hardhat");

async function main() {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");

    const simpleStorage = await SimpleStorage.deploy(789);

    // Wait until deployment is complete
    await simpleStorage.waitForDeployment();

    // Correct method name: getAddress()
    const address = await simpleStorage.getAddress();

    console.log("SimpleStorage deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });