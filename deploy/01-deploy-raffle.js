const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = networkConfig.chainId
    let vrfCoordinatorV2Address

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = etworkConfig[chainId]["gasLane"]
    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        //         /* Functions */
        //         constructor(
        //             address vrfCoordinatorV2,
        //             uint256 entranceFee,
        //             bytes32 gasLane,
        //             uint64 subscriptionId,
        //             uint16 callbackGasLimit,
        //             uint256 interval
        //         ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        //             i_entranceFee = entranceFee;
        //             i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        //             i_gasLane = gasLane;
        //             i_subscriptionId = subscriptionId;
        //             i_callbackGasLimit = callbackGasLimit;
        //             s_raffleState = RaffleState.OPEN;
        //             s_lastTimestamp = block.timestamp;
        //             i_interval = interval;
        //         }
    ]

    const raffle = await deploy("Raffle", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}
