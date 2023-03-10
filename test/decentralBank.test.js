const RWD = artifacts.require("RWD");
const Tether = artifacts.require("Tether");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  // runs before any other tests are performed
  before(async () => {
    // load contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // transfer all the tokens to decentralBank (1 million)
    await rwd.transfer(decentralBank.address, tokens("1000000"));

    // transfer 100 mock tokens to account 1 (customer)
    await tether.transfer(customer, tokens("100"), {
      from: owner,
    });
  });

  describe("Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });

  describe("RWD Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });

    // tast for new staker
    describe("Yield Farming", async () => {
      it("rewards token from staking", async () => {
        let result;

        // check inverstor balance
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "custormer mock wallet balance before staking"
        );
      });
    });
  });
});
