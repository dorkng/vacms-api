import csvParser from 'csv-parser';
import { Readable } from 'stream';
import serverConfig from '../config/server.config';
import { CsvFileParseType } from '../interfaces/csv.interface';
import { BadRequestError, ConflictError } from '../errors';

class CsvUtil {
  public async parseCsvFile(
    fileBuffer: Buffer,
    type?: CsvFileParseType,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Create a readable stream from the buffer
      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null); // Signal the end of the stream

      // get data from file
      const documents = [];

      readableStream
        .pipe(csvParser())
        .on('headers', (headers) => {
          if (type) {
            // get expected headers for the type
            const expectedHeaders = this.getExpectedHeaders(type);

            // Validate headers
            const isValidHeaders = expectedHeaders.every((header) =>
              headers.includes(header),
            );

            if (!isValidHeaders) {
              reject(new BadRequestError('Invalid CSV headers.'));
            }
          }
        })
        .on('data', (row) => {
          // Add row to documents array
          documents.push(row);
        })
        .on('end', () => {
          // Resolve with parsed documents
          resolve(documents);
        })
        .on('error', (error) => {
          serverConfig.DEBUG(`Error parsing CSV file: ${error}`);
          reject(error);
        });
    });
  }

  private getExpectedHeaders(type: CsvFileParseType): string[] {
    let expectedHeaders: string[] = [];
    if (type === CsvFileParseType.AWAITING_TRIAL_INMATE) {
      expectedHeaders = [
        'First Name',
        'Last Name',
        'Other Name',
        'Image',
        'Sex',
        'Custody Number',
        'Custodial Facility',
        'Case Number',
        'Court',
        'Offense',
        'Offense Interpretation',
        'Prosecuting Agency',
        'Date of Arraignment',
        'Date of Admission',
        'Other Means Of Id',
      ];
    } else if (type === CsvFileParseType.CUSTODIAL_FACILITY) {
      expectedHeaders = ['Name', 'Capacity', 'State'];
    } else {
      throw new ConflictError('Invalid CSV type.');
    }
    return expectedHeaders;
  }
}

export default new CsvUtil();
