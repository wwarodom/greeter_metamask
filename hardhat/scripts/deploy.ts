import { ethers } from "hardhat";

async function main() {
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();
  await greeter.setGreeting("New message");
  console.log("Get message: " + await greeter.greet());

  await greeter.donate( {value: ethers.utils.parseEther("0.1")} );
  console.log("Get balance: " + await greeter.balance());
  console.log("Greeter deployed to:", greeter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
