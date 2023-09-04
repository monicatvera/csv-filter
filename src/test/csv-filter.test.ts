import {CsvFilter} from "../core/csv-filter";

describe('CSV filter', () => {
	const header = 'Invoice_num, Date, Gross_amount, Net_amount, IVA, IGIC, Prod_or_service, client_CIF, client_NIF';
	it('output an empty list for an empty invoice list', () => {
		const csvFilter = CsvFilter.create([]);

		const result = csvFilter.filteredLines;

		expect(result).toEqual([]);
	});

	it('error out when given a one line list of invoices', () => {
		const invoiceLine = fileWithOneInvoiceLineHaving({});

		const result = () => CsvFilter.create([invoiceLine]);

		expect(result).toThrow();
	});

	describe('allow for', () => {
		it('correct lines only', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({});
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header, invoiceLine]);
		});

		it('multiple correct lines', () => {
			const invoiceLine1 = fileWithOneInvoiceLineHaving({ invoiceId: '1' });
			const invoiceLine2 = fileWithOneInvoiceLineHaving({ invoiceId: '2' });
			const csvFilter = CsvFilter.create([header, invoiceLine1, invoiceLine2]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header, invoiceLine1, invoiceLine2]);
		});
	});

	describe('remove lines with', () => {
		it('more than one tax type (IVA, IGIC)', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({ ivaTax: '21', igicTax: '7' });
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header]);
		});

		it('no tax field', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({ ivaTax: '', igicTax: '' });
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header]);
		});

		it('non decimal tax fields', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({ ivaTax: 'ABC', igicTax: '' });
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header]);
		});

		it('a miscalculated net amount for iva', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({ ivaTax: '21', igicTax: '', netAmount: '420' });
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header]);
		});

		it('a miscalculated net amount for igic', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({ ivaTax: '', igicTax: '7', netAmount: '420' });
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header]);
		});

		it('more than one ID type (CIF, NIF)', () => {
			const invoiceLine = fileWithOneInvoiceLineHaving({ nif: 'b1231231' });
			const csvFilter = CsvFilter.create([header, invoiceLine]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header]);
		});

		it('duplicated invoice IDs', () => {
			const invoiceLine1 = fileWithOneInvoiceLineHaving({ invoiceId: '1' });
			const invoiceLine2 = fileWithOneInvoiceLineHaving({ invoiceId: '1' });
			const invoiceLine3 = fileWithOneInvoiceLineHaving({ invoiceId: '3' });
			const invoiceLine4 = fileWithOneInvoiceLineHaving({ invoiceId: '4' });
			const invoiceLine5 = fileWithOneInvoiceLineHaving({ invoiceId: '3' });
			const csvFilter = CsvFilter.create([
				header,
				invoiceLine1,
				invoiceLine2,
				invoiceLine3,
				invoiceLine4,
				invoiceLine5,
			]);

			const result = csvFilter.filteredLines;

			expect(result).toEqual([header, invoiceLine4]);
		});
	});
});

type FileWithOneInvoiceLineHavingParams = {
	invoiceId?: string;
	ivaTax?: string;
	igicTax?: string;
	netAmount?: string;
	nif?: string;
};

const empty = '';
function fileWithOneInvoiceLineHaving({
	invoiceId = '1',
	ivaTax = '21',
	igicTax = empty,
	netAmount = '790',
	nif = empty,
}: FileWithOneInvoiceLineHavingParams) {
	const invoiceDate = '02/05/2019';
	const grossAmount = '1000';
	const concept = 'ACER Laptop';
	const cif = 'B76430134';
	return [invoiceId, invoiceDate, grossAmount, netAmount, ivaTax, igicTax, concept, cif, nif].join(',');
}