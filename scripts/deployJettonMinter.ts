import { toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { promptAddress, promptUrl } from '../wrappers/ui-utils';

const formatUrl = "https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain";
const exampleContent = {
    "name": "Sample Jetton",
    "description": "Sample of Jetton",
    "symbol": "JTN",
    "decimals": 0,
    "image": "https://www.svgrepo.com/download/483336/coin-vector.svg"
};

export async function run(provider: NetworkProvider) {

    const ui = provider.ui();
    const sender = provider.sender();
    const adminPrompt = `Please specify admin address`;
    ui.write(`Jetton deployer\nCurrent deployer only supports off-chain format:${formatUrl}`);

    let admin = await promptAddress(adminPrompt, ui, sender.address);
    ui.write(`Admin address:${admin}\n`);
    
    const urlPrompt = "Please specify url pointing to jetton metadata(json):";
    let contentUrl = await promptUrl(urlPrompt, ui);
    ui.write(`Jetton content url:${contentUrl}`);

    return;

    const jettonMinter = provider.open(JettonMinter.createFromConfig({}, await compile('JettonMinter')));

    await jettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonMinter.address);

    // run methods on `jettonMinter`
}
