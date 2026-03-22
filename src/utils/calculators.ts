// Pure calculation functions — no side effects, fully testable

export interface AmortizationYear {
  year: number;
  balanceStart: number;
  piPayment: number;
  interestPaid: number;
  principalPaid: number;
  balanceEnd: number;
  cumulativeEquityPct: number;
  cumulativePrincipalPaid: number;
  cumulativeInterestPaid: number;
  propertyTax: number;
  maintenance: number;
  insurance: number;
  hoa: number;
  appreciatedValue: number;
}

export interface TrueCostInputs {
  homePrice: number;
  downPaymentPct: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number; // annual %
  hoaMonthly: number;
  insuranceAnnual: number;
  maintenancePct: number; // annual % of home value
  appreciationRate: number; // annual %
  yearsToStay: number;
}

export interface TrueCostResults {
  // Bank side
  monthlyPI: number;
  totalInterestOverTerm: number;
  interestPctOfTotal: number;
  principalExceedsInterestYear: number;
  // True cost monthly
  monthlyPropertyTax: number;
  monthlyHOA: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  totalMonthlyTrueCost: number;
  // Over years to stay
  propertyTaxPaidOverStay: number;
  hoaPaidOverStay: number;
  insurancePaidOverStay: number;
  maintenancePaidOverStay: number;
  interestPaidOverStay: number;
  totalNonEquityCost: number;
  equityBuilt: number;
  homeValueAtExit: number;
  netPositionAtExit: number;
  // Summary
  principal: number;
  downPayment: number;
  totalPaidOverTerm: number;
}

export interface RentVsBuyInputs extends TrueCostInputs {
  monthlyRent: number;
  rentIncreaseRate: number; // annual %
  investmentReturnRate: number; // annual %
}

export interface RentVsBuyResults {
  buy: {
    monthlyPaymentYear1: number;
    totalPaidOverStay: number;
    equityAtExit: number;
    netPosition: number;
  };
  rent: {
    monthlyPaymentYear1: number;
    totalPaidOverStay: number;
    portfolioValue: number;
    netPosition: number;
  };
  buyWinsBy: number; // positive = buy wins, negative = rent wins
  primaryReason: string;
}

export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateAmortizationSchedule(inputs: TrueCostInputs): AmortizationYear[] {
  const {
    homePrice,
    downPaymentPct,
    interestRate,
    loanTerm,
    propertyTaxRate,
    hoaMonthly,
    insuranceAnnual,
    maintenancePct,
    appreciationRate,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const principal = homePrice - downPayment;
  const monthlyPI = calculateMonthlyPayment(principal, interestRate, loanTerm);
  const r = interestRate / 100 / 12;

  const schedule: AmortizationYear[] = [];
  let balance = principal;
  let cumulativePrincipalPaid = downPayment;
  let cumulativeInterestPaid = 0;

  for (let year = 1; year <= loanTerm; year++) {
    const balanceStart = balance;
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      const interestPayment = balance * r;
      const principalPayment = Math.min(monthlyPI - interestPayment, balance);
      yearInterest += interestPayment;
      yearPrincipal += principalPayment;
      balance = Math.max(0, balance - principalPayment);
    }

    cumulativePrincipalPaid += yearPrincipal;
    cumulativeInterestPaid += yearInterest;

    const appreciatedValue = homePrice * Math.pow(1 + appreciationRate / 100, year);
    const equityPct = ((cumulativePrincipalPaid) / appreciatedValue) * 100;

    const yearPropertyTax = homePrice * (propertyTaxRate / 100);
    const yearHOA = hoaMonthly * 12;
    const yearInsurance = insuranceAnnual;
    const yearMaintenance = homePrice * (maintenancePct / 100);

    schedule.push({
      year,
      balanceStart,
      piPayment: monthlyPI * 12,
      interestPaid: yearInterest,
      principalPaid: yearPrincipal,
      balanceEnd: balance,
      cumulativeEquityPct: equityPct,
      cumulativePrincipalPaid,
      cumulativeInterestPaid,
      propertyTax: yearPropertyTax,
      maintenance: yearMaintenance,
      insurance: yearInsurance,
      hoa: yearHOA,
      appreciatedValue,
    });
  }

  return schedule;
}

export function calculateTrueCost(inputs: TrueCostInputs): TrueCostResults {
  const {
    homePrice,
    downPaymentPct,
    interestRate,
    loanTerm,
    propertyTaxRate,
    hoaMonthly,
    insuranceAnnual,
    maintenancePct,
    appreciationRate,
    yearsToStay,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const principal = homePrice - downPayment;
  const monthlyPI = calculateMonthlyPayment(principal, interestRate, loanTerm);

  // Total over full term
  const totalPaidOverTerm = monthlyPI * loanTerm * 12 + downPayment;
  const totalInterestOverTerm = totalPaidOverTerm - homePrice;
  const interestPctOfTotal = (totalInterestOverTerm / totalPaidOverTerm) * 100;

  // Monthly true cost breakdown
  const monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12;
  const monthlyHOA = hoaMonthly;
  const monthlyInsurance = insuranceAnnual / 12;
  const monthlyMaintenance = (homePrice * maintenancePct / 100) / 12;
  const totalMonthlyTrueCost = monthlyPI + monthlyPropertyTax + monthlyHOA + monthlyInsurance + monthlyMaintenance;

  // Find year when principal > interest in monthly payment
  const r = interestRate / 100 / 12;
  let principalExceedsInterestYear = loanTerm;
  let balance = principal;
  for (let month = 1; month <= loanTerm * 12; month++) {
    const interestPmt = balance * r;
    const principalPmt = monthlyPI - interestPmt;
    balance -= principalPmt;
    if (principalPmt > interestPmt && principalExceedsInterestYear === loanTerm) {
      principalExceedsInterestYear = Math.ceil(month / 12);
    }
  }

  // Over years to stay
  const schedule = calculateAmortizationSchedule(inputs);
  const stayYears = Math.min(yearsToStay, loanTerm);
  const stayData = schedule.slice(0, stayYears);

  const propertyTaxPaidOverStay = stayData.reduce((s, y) => s + y.propertyTax, 0);
  const hoaPaidOverStay = stayData.reduce((s, y) => s + y.hoa, 0);
  const insurancePaidOverStay = stayData.reduce((s, y) => s + y.insurance, 0);
  const maintenancePaidOverStay = stayData.reduce((s, y) => s + y.maintenance, 0);
  const interestPaidOverStay = stayData.reduce((s, y) => s + y.interestPaid, 0);
  const principalPaidOverStay = stayData.reduce((s, y) => s + y.principalPaid, 0);

  const totalNonEquityCost =
    propertyTaxPaidOverStay +
    hoaPaidOverStay +
    insurancePaidOverStay +
    maintenancePaidOverStay +
    interestPaidOverStay;

  const equityBuilt = downPayment + principalPaidOverStay;
  const homeValueAtExit = homePrice * Math.pow(1 + appreciationRate / 100, stayYears);
  const netPositionAtExit = homeValueAtExit - (balance > 0 ? stayData[stayData.length - 1]?.balanceEnd ?? 0 : 0) - equityBuilt;

  // Calculate remaining balance at exit for net position
  const balanceAtExit = stayData.length > 0 ? stayData[stayData.length - 1].balanceEnd : 0;
  const actualEquity = homeValueAtExit - balanceAtExit;
  const totalCostOfOwnership =
    downPayment +
    stayData.reduce((s, y) => s + y.piPayment, 0) +
    propertyTaxPaidOverStay +
    hoaPaidOverStay +
    insurancePaidOverStay +
    maintenancePaidOverStay;
  const trueNetPosition = actualEquity - totalCostOfOwnership;

  return {
    monthlyPI,
    totalInterestOverTerm,
    interestPctOfTotal,
    principalExceedsInterestYear,
    monthlyPropertyTax,
    monthlyHOA,
    monthlyInsurance,
    monthlyMaintenance,
    totalMonthlyTrueCost,
    propertyTaxPaidOverStay,
    hoaPaidOverStay,
    insurancePaidOverStay,
    maintenancePaidOverStay,
    interestPaidOverStay,
    totalNonEquityCost,
    equityBuilt,
    homeValueAtExit,
    netPositionAtExit: trueNetPosition,
    principal,
    downPayment,
    totalPaidOverTerm,
  };
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResults {
  const {
    homePrice,
    downPaymentPct,
    interestRate,
    loanTerm,
    propertyTaxRate,
    hoaMonthly,
    insuranceAnnual,
    maintenancePct,
    appreciationRate,
    yearsToStay,
    monthlyRent,
    rentIncreaseRate,
    investmentReturnRate,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const stayYears = Math.min(yearsToStay, loanTerm);

  // BUY SCENARIO
  const trueCost = calculateTrueCost(inputs);
  const schedule = calculateAmortizationSchedule(inputs);
  const stayData = schedule.slice(0, stayYears);

  const totalBuyPaid =
    downPayment +
    stayData.reduce((s, y) => s + y.piPayment + y.propertyTax + y.hoa + y.insurance + y.maintenance, 0);

  const balanceAtExit = stayData.length > 0 ? stayData[stayData.length - 1].balanceEnd : 0;
  const homeValueAtExit = homePrice * Math.pow(1 + appreciationRate / 100, stayYears);
  const buyEquity = homeValueAtExit - balanceAtExit;
  const buyNetPosition = buyEquity - totalBuyPaid;

  // RENT SCENARIO
  let totalRentPaid = 0;
  let currentRent = monthlyRent;
  for (let year = 1; year <= stayYears; year++) {
    totalRentPaid += currentRent * 12;
    currentRent *= 1 + rentIncreaseRate / 100;
  }

  // Investment of down payment + monthly savings
  // Down payment invested from day 1
  let portfolio = downPayment;
  const monthlyBuyTrue = trueCost.totalMonthlyTrueCost;
  let rentMonthly = monthlyRent;

  for (let year = 1; year <= stayYears; year++) {
    // Monthly savings = what you'd pay for buy - what you pay for rent
    const monthlySavings = Math.max(0, monthlyBuyTrue - rentMonthly);
    for (let month = 1; month <= 12; month++) {
      portfolio = portfolio * (1 + investmentReturnRate / 100 / 12) + monthlySavings;
    }
    rentMonthly *= 1 + rentIncreaseRate / 100;
  }

  const rentNetPosition = portfolio - totalRentPaid;

  // Determine primary reason
  let primaryReason = '';
  if (buyNetPosition > rentNetPosition) {
    if (appreciationRate >= 4) primaryReason = 'strong appreciation';
    else if (stayYears >= 10) primaryReason = 'long stay duration';
    else primaryReason = 'equity accumulation';
  } else {
    if (interestRate >= 6) primaryReason = 'high interest rate';
    else if (stayYears < 7) primaryReason = 'short stay duration';
    else if (investmentReturnRate >= 8) primaryReason = 'high investment returns';
    else primaryReason = 'low appreciation';
  }

  return {
    buy: {
      monthlyPaymentYear1: trueCost.totalMonthlyTrueCost,
      totalPaidOverStay: totalBuyPaid,
      equityAtExit: buyEquity,
      netPosition: buyNetPosition,
    },
    rent: {
      monthlyPaymentYear1: monthlyRent,
      totalPaidOverStay: totalRentPaid,
      portfolioValue: portfolio,
      netPosition: rentNetPosition,
    },
    buyWinsBy: buyNetPosition - rentNetPosition,
    primaryReason,
  };
}
