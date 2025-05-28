export const services = [
  {
    id: 'pancard',
    name: 'panCard',
    displayName: 'PAN Card',
    category: 'identity',
    fees: '₹500',
    timeRequired: '15-20 days',
    description: 'Apply for a new PAN card or make corrections to your existing PAN card details.',
    logo: '💳',
    requiredDocuments: [
      'Proof of Identity (Aadhaar/Passport/Driving License)',
      'Proof of Address (Aadhaar/Utility Bill/Bank Statement)',
      'Passport-sized Photograph',
      'Date of Birth Proof'
    ]
  },
  {
    id: 'aadharcard',
    name: 'aadharCard',
    displayName: 'Aadhar Card',
    category: 'identity',
    fees: '₹200',
    timeRequired: '7-10 days',
    description: 'Update your Aadhar card Adhaar carad is details or apply for a new Aadhar card.',
    logo: '🪪',
    requiredDocuments: [
      'Proof of Identity (PAN Card/Passport/Voter ID)',
      'Proof of Address (Utility Bill/Ration Card)',
      'Date of Birth Proof',
      'Mobile Number Linked with Aadhaar'
    ]
  },
  {
    id: 'voterid',
    name: 'voterID',
    displayName: 'Voter ID',
    category: 'identity',
    fees: '₹300',
    timeRequired: '20-25 days',
    description: 'Register for a new Voter ID card is important or update your existing voter information.',
    logo: '🗳️',
    requiredDocuments: [
      'Proof of Age (Birth Certificate/10th Certificate)',
      'Proof of Address (Aadhaar/Utility Bill)',
      'Passport-sized Photograph',
      'Form 6 for New Registration'
    ]
  },
  {
    id: 'passport',
    name: 'passport',
    displayName: 'Passport',
    category: 'identity',
    fees: '₹1500',
    timeRequired: '30-45 days',
    description: 'Apply for a new passport, renew your existing passport or apply for passport services.',
    logo: '🛂',
    requiredDocuments: [
      'Proof of Date of Birth',
      'Address Proof (Aadhaar/Utility Bill)',
      'PAN Card',
      'Passport-sized Photographs with White Background',
      'Old Passport (for renewal)'
    ]
  },
  {
    id: 'drivinglicense',
    name: 'drivingLicense',
    displayName: 'Driving License',
    category: 'identity',
    fees: '₹800',
    timeRequired: '15-20 days',
    description: 'Apply for a new driving license or renew your existing driving license.',
    logo: '🚗',
    requiredDocuments: [
      'Age Proof (Birth Certificate/10th Certificate)',
      'Address Proof (Aadhaar/Utility Bill)',
      'Medical Certificate (Form 1A)',
      'Passport-sized Photographs',
      "Learner's License (for new DL)"
    ]
  },
  {
    id: 'incometax',
    name: 'incomeTax',
    displayName: 'Income Tax Return',
    category: 'financial',
    fees: '₹1000',
    timeRequired: '3-5 days',
    description: 'File your income tax returns with expert assistance and guidance.',
    logo: '💰',
    requiredDocuments: [
      'PAN Card',
      'Aadhaar Card',
      'Form 16 (if salaried)',
      'Bank Statements',
      'Investment Proofs (if any)',
      "Previous Year's ITR (if applicable)"
    ]
  },
  {
    id: 'birthcertificate',
    name: 'birthCertificate',
    displayName: 'Birth Certificate',
    category: 'education',
    fees: '₹400',
    timeRequired: '10-15 days',
    description: 'Apply for a birth certificate or get a duplicate copy of your birth certificate.',
    logo: '👶',
    requiredDocuments: [
      'Hospital Birth Record',
      "Parents' Identity Proof",
      "'Parents' Marriage Certificate'",
      'Address Proof at Time of Birth',
      'Affidavit for Delayed Registration (if applicable)'
    ]
  },
  {
    id: 'propertyregistration',
    name: 'propertyRegistration',
    displayName: 'Property Registration',
    category: 'property',
    fees: '₹2500',
    timeRequired: '25-30 days',
    description: 'Register your property documents and complete all legal formalities.',
    logo: '🏠',
    requiredDocuments: [
      'Sale Deed',
      'Property Tax Receipts',
      'Encumbrance Certificate',
      'Identity Proof of Buyer & Seller',
      'Passport-sized Photographs',
      'Stamp Duty Payment Proof'
    ]
  }
];

  export const filters = [
    { id: 'all', name: 'All Documents', icon: '🔍' },
    { id: 'identity', name: 'identity Documents', icon: '🪪' },
    { id: 'financial', name: 'financial Documents', icon: '💰' },
    { id: 'education', name: 'education Documents', icon: '🎓' },
    { id: 'property', name: 'property Documents', icon: '🏠' }
  ];