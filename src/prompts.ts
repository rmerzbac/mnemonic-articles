import React from "react";

const demoText = "The Battle of Cannae (/ˈkæni, -eɪ, -aɪ/;[b] Latin: [ˈkanːae̯]) was a key engagement of the Second Punic War between the Roman Republic and Carthage, fought on 2 August 216 BC near the ancient village of Cannae in Apulia, southeast Italy. The Carthaginians and their allies, led by Hannibal, surrounded and practically annihilated a larger Roman and Italian army under the consuls Lucius Aemilius Paullus and Gaius Terentius Varro. It is regarded as one of the greatest tactical feats in military history and one of the worst defeats in Roman history.\n";

const demoTextFull = "The Battle of Cannae (/ˈkæni, -eɪ, -aɪ/;[b] Latin: [ˈkanːae̯]) was a key engagement of the Second Punic War between the Roman Republic and Carthage, fought on 2 August 216 BC near the ancient village of Cannae in Apulia, southeast Italy. The Carthaginians and their allies, led by Hannibal, surrounded and practically annihilated a larger Roman and Italian army under the consuls Lucius Aemilius Paullus and Gaius Terentius Varro. It is regarded as one of the greatest tactical feats in military history and one of the worst defeats in Roman history.\n\
    Having recovered from their losses at Trebia (218 BC) and Lake Trasimene (217 BC), the Romans decided to engage Hannibal at Cannae, with approximately 86,000 Roman and allied troops. They massed their heavy infantry in a deeper formation than usual, while Hannibal used the double envelopment tactic and surrounded his enemy, trapping the majority of the Roman army, who were then slaughtered. The loss of life on the Roman side meant it was one of the most lethal single days of fighting in history; Adrian Goldsworthy equates the death toll at Cannae to \"the massed slaughter of the British Army on the first day of the Somme offensive in 1916\".[3] Only about 15,000 Romans, most of whom were from the garrisons of the camps and had not taken part in the battle, escaped death. Following the defeat, Capua and several other Italian city-states defected from the Roman Republic to Carthage.\n\
    As news of this defeat reached Rome, the city was gripped in panic. Authorities resorted to extraordinary measures, which included consulting the Sibylline Books, dispatching a delegation led by Quintus Fabius Pictor to consult the Delphic oracle in Greece, and burying four people alive as a sacrifice to their gods. To raise two new legions, the authorities lowered the draft age and enlisted criminals, debtors and even slaves. Despite the extreme loss of men and equipment, and a second massive defeat later that same year at Silva Litana, the Romans refused to surrender to Hannibal. His offer to ransom survivors was brusquely refused. The Romans fought for 14 more years until they achieved victory at the Battle of Zama.\n\
    Although for most of the following decades the battle was seen solely as a major Roman disaster, by modern times Cannae acquired a mythic quality, and is often used as an example of the perfect defeat of an enemy army.\n\
    Strategic background\n\
    Hannibal's route of invasion\n\
    Shortly after the start of the Second Punic War, Hannibal crossed into Italy by traversing the Pyrenees and the Alps during the summer and early autumn of 218 BC.[4] He quickly won major victories over the Romans at Trebia and at Lake Trasimene.[5][6] After these losses, the Romans appointed Quintus Fabius Maximus Verrucosus as dictator to deal with the threat.[7][8] Fabius used attrition warfare against Hannibal, cutting off his supply lines and avoiding pitched battles. These tactics proved unpopular with the Romans who, as they recovered from the shock of Hannibal's victories, began to question the wisdom of the Fabian strategy, which had given the Carthaginian army a chance to regroup.[9] The majority of Romans were eager to see a quick conclusion to the war. It was feared that, if Hannibal continued plundering Italy unopposed, Rome's allies might defect to the Carthaginian side for self-preservation.[10]\n\
    Battles of Trebia, Lake Trasimene and Cannae, anticlockwise, from top\n\
    Therefore, when Fabius came to the end of his term, the Senate did not renew his dictatorial powers and command was given to consuls Gnaeus Servilius Geminus and Marcus Atilius Regulus.[11] In 216 BC, when elections resumed, Gaius Terentius Varro and Lucius Aemilius Paullus were elected as consuls, placed in command of a newly raised army of unprecedented size and directed to engage Hannibal.[12] Polybius wrote:\n\
    The Senate determined to bring eight legions into the field, which had never been done at Rome before, each legion consisting of five thousand men besides allies. ...Most of their wars are decided by one consul and two legions, with their quota of allies; and they rarely employ all four at one time and on one service. But on this occasion, so great was the alarm and terror of what would happen, they resolved to bring not only four but eight legions into the field.\n\
    — Polybius, The Histories of Polybius[13]\n";


type PromptListType = {
    [key: number]: string;
};

const promptList: PromptListType = {
    0: "Write an introductory paragraph about {topic}.\n",
    1: "Write a second paragraph that elaborates on the first.\n",
    2: "Begin to get more specific.\n",
    3: "Continue to dive deeper into the topic, getting gradually more and more complex.\n",
};

function getPrompt(queryNumber: number, topic: string | null = null): string {
    let prompt: string;
    if (queryNumber > 3) {
        queryNumber = 3;
    }
    prompt = promptList[queryNumber];

    if (topic) {
        prompt = prompt.replace("{topic}", topic);
    }
    return prompt;
};

const questionOptions: PromptListType = {
    0: "free response",
    1: "true/false",
    2: "multiple choice"
}

export function defaultPrompt(text = demoText) {
    // const randomNum = Math.floor(Math.random() * 3);
    
    // Add other options
    return "Summarize this text thoroughly in bullet points, and write a multiple choice question about the topic that can be answered \
        using only the summarized information.\n\
        Respond in the form \
        {\"summary\": [<your bullet points>], \
        \"questionType\": \"multiple\", \
        \"question\":\"<your question>\", \
        \"options\":[<your options>]}\n\n"
        + text;
}

export function multipleChoiceAnswer(text: string, question: string) {
    return "I answered \"" + text + "\" to the question \n\"" + question +"\". \
    Is this correct? Respond in the form \
    {\"evaluation\": <\"Correct\"/\"Incorrect\">], \
        \"reason\": \"<reason>\"}";
}
  