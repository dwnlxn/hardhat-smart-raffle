const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", async function () {
          let raffleContract, raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, player
          const chainId = network.config.chainId

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]
              await deployments.fixture(["all"])
              raffleContract = await ethers.getContract("Raffle", deployer) // deploy new raffleContract
              raffle = await raffleContract.connect(player) // connect raffle to test player account
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("constructor", async function () {
              it("Initializes the raffle correctly", async function () {
                  // Ideally the test have 1 assert per it
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
                  const interval = await raffle.getInterval()
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
                  const entranceFee = raffle.getEntranceFee()
                  assert.equal(entranceFee.toString(), networkConfig[chainId]["entranceFee"])
              })
          })

          describe("enter raffle", async function () {
              it("reverts when you don't pay enough ", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered"
                  )
              })

              it("records players when they enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee }) // player account enters raffle
                  const playerAddressFromContract = await raffle.getPlayer(0) // retrieve the added player address
                  assert.equal(playerAddressFromContract, player.address) // compare
              })

              it("emits event on enter", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEnter"
                  )
              })
          })
      })
