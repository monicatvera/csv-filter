export class CsvFilter {
	private decimalRegex = '\\d+(\\.\\d+)?';
	private constructor(private readonly lines: string[]) {}

	static create(lines: string[]) {
		if (lines.length === 1) {
			throw new Error('Single line is not allowed');
		}
		return new CsvFilter(lines);
	}

	get filteredLines() {
		const header = this.lines[0];
		const invoices = this.lines.slice(1);

		const validInvoices = invoices.filter(this.validInvoice);
		const uniqueAndValidInvoices = this.filterUniqueInvoices(validInvoices);

		return [header].concat(uniqueAndValidInvoices);
	}

	private filterUniqueInvoices(invoices: string[]) {
		const invoicesIds = invoices.map(this.invoiceId);
		const duplicated = invoicesIds.filter((id, index) => invoicesIds.indexOf(id) !== index);
		return invoices.filter((invoice) => !duplicated.includes(this.invoiceId(invoice)));
	}

	private validInvoice = (invoice: string) => {
		const fields = invoice.split(',');
		const ivaField = fields[4];
		const igicField = fields[5];
		const taxFieldsAreNumbers = ivaField.match(this.decimalRegex) || igicField.match(this.decimalRegex);
		const onlyOneTaxFieldIsPresent = !ivaField || !igicField;
		const taxIsValid = taxFieldsAreNumbers && onlyOneTaxFieldIsPresent;

		const grossAmount = fields[2];
		const netAmount = fields[3];
		const netAmountIsValid =
			this.amountIsCorrect(netAmount, grossAmount, ivaField) || this.amountIsCorrect(netAmount, grossAmount, igicField);

		const cif = fields[7];
		const nif = fields[8];
		const onlyOneID = !cif || !nif;

		return taxIsValid && netAmountIsValid && onlyOneID;
	};

	private amountIsCorrect(netAmount: string, grossAmount: string, tax: string): boolean {
		const parsedNet = parseFloat(netAmount);
		const parsedGross = parseFloat(grossAmount);
		const parsedTax = parseFloat(tax);
		return parsedNet === parsedGross - (parsedGross * parsedTax) / 100;
	}

	private invoiceId(invoice: string) {
		return invoice.split(',')[0];
	}
}