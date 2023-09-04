# Kata CSV Filter
The proposal is a small program that filters the data from a file in .csv (comma separated values) format to return another .csv file.

This is a .csv with invoice information. Each line is part of the data of an invoice, except the first one that contains the name of the fields. As you can see in the slide, this would be an example of the file.

```text 
Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente
1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,
2,03/08/2019,2000,2000,,8,MacBook Pro,,78544372A
3,03/12/2019,1000,2000,19,8, LenovoLaptop,,78544372A
```

## Test list
List of possible tests that we want to do based on their difficulty:
- [] A file with a single invoice where everything is correct should produce the same line as output.
- [] A file with a single invoice where VAT and IGIC are filled in should eliminate the line.
- [] A file with a single invoice where the net is incorrectly calculated should be deleted.
- [] A file with a single invoice where CIF and NIF are filled in should eliminate the line
- [] If the invoice number is repeated on multiple lines, all of them are deleted (leaving no lines).
- [] An empty list will produce an empty list output.
- [] A single line file is incorrect because it has no header.