import { StudyDocument } from '../types';

export const SAMPLE_DOCUMENTS: StudyDocument[] = [
  {
    id: 'sample-cell-bio',
    userId: 'demo-user',
    fileName: 'Cellular_Respiration_and_Genetics.pdf',
    fileSize: 2450000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    title: 'Cellular Respiration & Molecular Genetics',
    summary: 'A foundational overview of biological energy conversion through aerobic respiration alongside DNA replication and protein synthesis mechanisms. Focuses on ATP yield calculations and mitochondrial membrane transport dynamics.',
    extractedSnippet: 'Glycolysis occurs in the cytosol producing 2 net ATP and 2 NADH. The citric acid cycle takes place in the mitochondrial matrix, while oxidative phosphorylation occurs along the cristae...',
    isTruncated: false,
    topics: [
      {
        id: 'cb-1',
        title: 'Glycolysis & Substrate Phosphorylation',
        bullets: [
          'Occurs entirely in the cellular cytosol without requiring molecular oxygen.',
          'Consumes two ATP molecules in the preparatory phase to activate glucose.',
          'Generates a net gain of two ATP molecules and two NADH carriers.',
          'Splits one six-carbon glucose molecule into two three-carbon pyruvate molecules.'
        ]
      },
      {
        id: 'cb-2',
        title: 'The Krebs / Citric Acid Cycle',
        bullets: [
          'Takes place inside the mitochondrial matrix after pyruvate oxidation to acetyl-CoA.',
          'Produces three NADH, one FADH2, and one GTP per turn of cycle.',
          'Releases two carbon dioxide molecules per turn as metabolic waste.',
          'Oxaloacetate regenerates continuously to combine with arriving acetyl-CoA molecules.'
        ]
      },
      {
        id: 'cb-3',
        title: 'Oxidative Phosphorylation & Chemiosmosis',
        bullets: [
          'Electrons transfer along inner mitochondrial membrane complexes I through IV.',
          'Protons pump into the intermembrane space establishing a steep electrochemical gradient.',
          'ATP synthase harnesses the proton motive force to synthesize ATP molecules.',
          'Oxygen serves as the terminal electron acceptor, forming metabolic water.'
        ]
      },
      {
        id: 'cb-4',
        title: 'DNA Replication & Leading vs Lagging Strands',
        bullets: [
          'DNA helicase unwinds the double helix at the designated replication fork.',
          'DNA polymerase synthesizes daughter strands exclusively in the 5 prime to 3 prime direction.',
          'Leading strand synthesizes continuously toward the unwinding replication fork.',
          'Lagging strand synthesizes discontinuously producing Okazaki fragments joined by ligase.'
        ]
      }
    ],
    keyTerms: [
      { term: 'Chemiosmosis', definition: 'The movement of ions across a semipermeable membrane down their electrochemical gradient, used to generate ATP.' },
      { term: 'ATP Synthase', definition: 'Mitochondrial enzyme that catalyzes ATP synthesis using energy from a transmembrane proton gradient.' },
      { term: 'Okazaki Fragments', definition: 'Short DNA sequences synthesized discontinuously on the lagging strand during DNA replication.' },
      { term: 'Allosteric Regulation', definition: 'The regulation of an enzyme by binding an effector molecule at a site other than the active site.' },
      { term: 'Proton Motive Force', definition: 'The potential energy stored in an electrochemical gradient of protons across a biological membrane.' },
      { term: 'NADH / FADH2', definition: 'High-energy electron carrier coenzymes that donate electrons to the electron transport chain.' }
    ],
    examTips: [
      'Examiners frequently test the difference in ATP yield between substrate-level phosphorylation versus oxidative phosphorylation.',
      'Remember: DNA polymerase requires a pre-existing RNA primer; it cannot initiate nucleotide polymer synthesis de novo.',
      'Always verify whether a question asks for net ATP yield per glucose molecule (2 ATP in glycolysis, ~30-32 total) or per pyruvate (halve it!).',
      'Uncouplers (e.g., DNP) dissipate the proton gradient without blocking the electron transport chain, generating heat instead of ATP.'
    ],
    explanations: {
      'cb-3': {
        topicId: 'cb-3',
        simpleExplanation: 'Oxidative phosphorylation is like a hydroelectric dam inside the cell. Electrons flow down protein complexes, pumping protons across the membrane into a reservoir. When protons rush back through ATP synthase turbines, ADP is charged into ATP.',
        diagramType: 'flow',
        diagramData: {
          steps: [
            { step: 1, title: 'Electron Delivery', description: 'NADH and FADH2 deposit electrons at Complexes I and II.' },
            { step: 2, title: 'Proton Pumping', description: 'Energy from electron transfers pumps H+ into intermembrane space.' },
            { step: 3, title: 'Gradient Formation', description: 'High concentration builds up an electrochemical proton motive force.' },
            { step: 4, title: 'ATP Synthesis', description: 'H+ rushes through ATP synthase, spinning the rotor to produce ATP.' }
          ]
        },
        realLifeExample: 'Think of winding a mechanical watch: NADH and FADH2 wind the spring by pumping protons, and ATP synthase is the spinning gear that releases the energy to power your cellular tasks.',
        memoryTrick: 'Remember O-P-A-T: Oxidize carriers, Pump protons, Activate turbine, Turn out ATP.',
        generatedAt: new Date().toISOString()
      }
    },
    testHistory: [
      {
        id: 'test-1',
        date: new Date(Date.now() - 3600000 * 12).toISOString(),
        difficulty: 'Medium',
        score: 4,
        totalQuestions: 5,
        percentage: 80,
        missedQuestions: [
          {
            question: 'What is the direct energy source that fuels ATP synthase during oxidative phosphorylation?',
            userAnswer: 'Hydrolysis of GTP in the matrix',
            correctAnswer: 'Electrochemical proton gradient across the inner membrane',
            explanation: 'Protons accumulated in the intermembrane space flow down their gradient through ATP synthase, physically turning its catalytic head to phosphorylate ADP.'
          }
        ]
      }
    ]
  },
  {
    id: 'sample-macroeconomics',
    userId: 'demo-user',
    fileName: 'Macroeconomics_Monetary_Fiscal_Policy.pdf',
    fileSize: 1840000,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    title: 'Macroeconomics: Monetary & Fiscal Stabilization',
    summary: 'A core curriculum analysis of macroeconomic tools used by central banks and governments to combat inflation and unemployment, evaluating the Phillips curve, interest rate transmission, and Keynesian multipliers.',
    extractedSnippet: 'When the central bank lowers the reserve requirement or buys government bonds, the monetary base expands, lowering nominal interest rates and stimulating aggregate demand...',
    isTruncated: false,
    topics: [
      {
        id: 'me-1',
        title: 'Central Bank Monetary Transmission Mechanisms',
        bullets: [
          'Central banks adjust policy rates to influence short-term commercial lending rates.',
          'Open market operations directly expand or contract the banking system liquidity reserves.',
          'Lower interest rates reduce borrowing costs, encouraging capital investment and consumption.',
          'Exchange rate channels affect net export competitiveness through currency appreciation or depreciation.'
        ]
      },
      {
        id: 'me-2',
        title: 'Fiscal Policy & The Government Expenditure Multiplier',
        bullets: [
          'Government spending injects direct demand into the circular flow of income.',
          'Marginal propensity to consume dictates the eventual magnitude of multiplier expansion.',
          'Tax cuts provide disposable income but experience a smaller initial multiplier effect.',
          'Crowding-out effects occur when heavy deficit borrowing drives up market interest rates.'
        ]
      },
      {
        id: 'me-3',
        title: 'The Phillips Curve & Stagflation Dynamics',
        bullets: [
          'Short-run Phillips curve illustrates an inverse tradeoff between inflation and unemployment rates.',
          'Supply-side negative shocks shift the short-run Phillips curve upward, creating stagflation.',
          'Long-run Phillips curve remains vertical at the non-accelerating inflation rate of unemployment.',
          'Adaptive vs rational expectations govern how quickly wages adjust to monetary surprises.'
        ]
      }
    ],
    keyTerms: [
      { term: 'Monetary Multiplier', definition: 'The ratio of commercial bank money or broad money created to the central bank base money.' },
      { term: 'Crowding Out', definition: 'A situation where increased government spending decreases private sector investment due to higher interest rates.' },
      { term: 'Quantitative Easing', definition: 'An unconventional monetary policy where a central bank purchases longer-term securities to lower long-term yields.' },
      { term: 'NAIRU', definition: 'The non-accelerating inflation rate of unemployment; the natural baseline level where inflation remains steady.' }
    ],
    examTips: [
      'Questions love comparing the tax multiplier (MPC / (1 - MPC)) with the spending multiplier (1 / (1 - MPC)). The spending multiplier is always larger by 1!',
      'Watch out for the time-lag traps: recognition lag, legislative lag, and implementation lag in fiscal policy vs monetary policy.',
      'Remember that in the long run, money is neutral: monetary expansion affects nominal variables (price level), not real GDP.'
    ],
    testHistory: []
  }
];
