import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Namespace', () => {
  describe('isNotEmpty', () => {
    it('повинен повертати true для непорожнього рядка', () => {
      expect(Validation.isNotEmpty('Книга')).to.be.true;
    });

    it('повинен повертати false для порожнього рядка або рядка з пробілів', () => {
      expect(Validation.isNotEmpty('')).to.be.false;
      expect(Validation.isNotEmpty('   ')).to.be.false;
    });
  });

  describe('isValidUserId', () => {
    it('повинен повертати true для суто числового ідентифікатора', () => {
      expect(Validation.isValidUserId('1725533394038')).to.be.true;
      expect(Validation.isValidUserId('12345')).to.be.true;
    });

    it('повинен повертати false, якщо є літери або спецсимволи', () => {
      expect(Validation.isValidUserId('user123')).to.be.false;
      expect(Validation.isValidUserId('12-34')).to.be.false;
    });
  });

  describe('isValidYear', () => {
    it('повинен повертати true для валідного року з 4 цифр', () => {
      expect(Validation.isValidYear('2004')).to.be.true;
      expect(Validation.isValidYear('1999')).to.be.true;
    });

    it('повинен повертати false для некоректного формату або року з майбутнього', () => {
      expect(Validation.isValidYear('abc')).to.be.false;
      expect(Validation.isValidYear('99')).to.be.false;
      expect(Validation.isValidYear('3000')).to.be.false;
    });
  });
});
