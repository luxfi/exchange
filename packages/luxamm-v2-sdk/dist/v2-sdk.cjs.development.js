'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sdkCore = require('@uniswap/sdk-core');
var JSBI = _interopDefault(require('jsbi'));
var address = require('@ethersproject/address');
var bignumber = require('@ethersproject/bignumber');
var solidity = require('@ethersproject/solidity');
var invariant = _interopDefault(require('tiny-invariant'));

/**
 * @deprecated use FACTORY_ADDRESS_MAP instead
 */
var FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
var FACTORY_ADDRESS_MAP = sdkCore.V2_FACTORY_ADDRESSES;
var INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
var MINIMUM_LIQUIDITY = /*#__PURE__*/JSBI.BigInt(1000);
// exports for internal consumption
var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var FIVE = /*#__PURE__*/JSBI.BigInt(5);
var _997 = /*#__PURE__*/JSBI.BigInt(997);
var _1000 = /*#__PURE__*/JSBI.BigInt(1000);
var BASIS_POINTS = /*#__PURE__*/JSBI.BigInt(10000);
var ZERO_PERCENT = /*#__PURE__*/new sdkCore.Percent(ZERO);
var ONE_HUNDRED_PERCENT = /*#__PURE__*/new sdkCore.Percent(ONE);

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelperLoose(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function () {
      return o >= r.length ? {
        done: !0
      } : {
        done: !1,
        value: r[o++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = 'setPrototypeOf' in Object;
/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */
var InsufficientReservesError = /*#__PURE__*/function (_Error) {
  function InsufficientReservesError() {
    var _this;
    _this = _Error.call(this) || this;
    _this.isInsufficientReservesError = true;
    _this.name = _this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_this, (this instanceof InsufficientReservesError ? this.constructor : void 0).prototype);
    return _this;
  }
  _inheritsLoose(InsufficientReservesError, _Error);
  return InsufficientReservesError;
}(/*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */
var InsufficientInputAmountError = /*#__PURE__*/function (_Error2) {
  function InsufficientInputAmountError() {
    var _this2;
    _this2 = _Error2.call(this) || this;
    _this2.isInsufficientInputAmountError = true;
    _this2.name = _this2.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_this2, (this instanceof InsufficientInputAmountError ? this.constructor : void 0).prototype);
    return _this2;
  }
  _inheritsLoose(InsufficientInputAmountError, _Error2);
  return InsufficientInputAmountError;
}(/*#__PURE__*/_wrapNativeSuper(Error));

var computePairAddress = function computePairAddress(_ref) {
  var factoryAddress = _ref.factoryAddress,
    tokenA = _ref.tokenA,
    tokenB = _ref.tokenB;
  var _ref2 = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
    token0 = _ref2[0],
    token1 = _ref2[1]; // does safety checks
  return address.getCreate2Address(factoryAddress, solidity.keccak256(['bytes'], [solidity.pack(['address', 'address'], [token0.address, token1.address])]), INIT_CODE_HASH);
};
var Pair = /*#__PURE__*/function () {
  function Pair(currencyAmountA, tokenAmountB) {
    var tokenAmounts = currencyAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
    ? [currencyAmountA, tokenAmountB] : [tokenAmountB, currencyAmountA];
    this.liquidityToken = new sdkCore.Token(tokenAmounts[0].currency.chainId, Pair.getAddress(tokenAmounts[0].currency, tokenAmounts[1].currency), 18, 'UNI-V2', 'Uniswap V2');
    this.tokenAmounts = tokenAmounts;
  }
  Pair.getAddress = function getAddress(tokenA, tokenB) {
    var _FACTORY_ADDRESS_MAP$;
    var factoryAddress = (_FACTORY_ADDRESS_MAP$ = FACTORY_ADDRESS_MAP[tokenA.chainId]) != null ? _FACTORY_ADDRESS_MAP$ : FACTORY_ADDRESS;
    return computePairAddress({
      factoryAddress: factoryAddress,
      tokenA: tokenA,
      tokenB: tokenB
    });
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */;
  var _proto = Pair.prototype;
  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */;
  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */;
  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  }
  /**
   * getAmountOut is the linear algebra of reserve ratio against amountIn:amountOut.
   * https://ethereum.stackexchange.com/questions/101629/what-is-math-for-uniswap-calculates-the-amountout-and-amountin-why-997-and-1000
   * has the math deduction for the reserve calculation without fee-on-transfer fees.
   *
   * With fee-on-transfer tax, intuitively it's just:
   * inputAmountWithFeeAndTax = 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
   *                          = (1 - amountIn.sellFeesBips / 10000) * amountInWithFee
   * where amountInWithFee is the amountIn after taking out the LP fees
   * outputAmountWithTax = amountOut * (1 - amountOut.buyFeesBips / 10000)
   *
   * But we are illustrating the math deduction below to ensure that's the case.
   *
   * before swap A * B = K where A = reserveIn B = reserveOut
   *
   * after swap A' * B' = K where only k is a constant value
   *
   * getAmountOut
   *
   * A' = A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn # here 0.3% is deducted
   * B' = B - amountOut * (1 - amountOut.buyFeesBips / 10000)
   * amountOut = (B - B') / (1 - amountOut.buyFeesBips / 10000) # where A' * B' still is k
   *           = (B - K/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   *           = (B - AB/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   *           = ((BA + B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn - AB)/(A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn))
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   *           = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn / (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
   *             /
   *             (1 - amountOut.buyFeesBips / 10000)
   * amountOut * (1 - amountOut.buyFeesBips / 10000) = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
   *                                                    /
   *                                                    (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
   *
   * outputAmountWithTax = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn
   *                       /
   *                       (A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn)
   *                       = (B * 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn * 1000
   *                       /
   *                       ((A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn) * 1000)
   *                     = (B * (1 - amountIn.sellFeesBips / 10000) 997 * * amountIn
   *                       /
   *                       (1000 * A + (1 - amountIn.sellFeesBips / 10000) * 997 * amountIn)
   *                     = (B * (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee)
   *                       /
   *                       (1000 * A + (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee)
   *                     = (B * inputAmountWithFeeAndTax)
   *                       /
   *                       (1000 * A + inputAmountWithFeeAndTax)
   *
   * inputAmountWithFeeAndTax = (1 - amountIn.sellFeesBips / 10000) * inputAmountWithFee
   * outputAmountWithTax = amountOut * (1 - amountOut.buyFeesBips / 10000)
   *
   * @param inputAmount
   * @param calculateFotFees
   */;
  _proto.getOutputAmount = function getOutputAmount(inputAmount, calculateFotFees) {
    if (calculateFotFees === void 0) {
      calculateFotFees = true;
    }
    !this.involvesToken(inputAmount.currency) ?  invariant(false, 'TOKEN')  : void 0;
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError();
    }
    var inputReserve = this.reserveOf(inputAmount.currency);
    var outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0);
    var percentAfterSellFees = calculateFotFees ? this.derivePercentAfterSellFees(inputAmount) : ZERO_PERCENT;
    var inputAmountAfterTax = percentAfterSellFees.greaterThan(ZERO_PERCENT) ? sdkCore.CurrencyAmount.fromRawAmount(inputAmount.currency, percentAfterSellFees.multiply(inputAmount).quotient // fraction.quotient will round down by itself, which is desired
    ) : inputAmount;
    var inputAmountWithFeeAndAfterTax = JSBI.multiply(inputAmountAfterTax.quotient, _997);
    var numerator = JSBI.multiply(inputAmountWithFeeAndAfterTax, outputReserve.quotient);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _1000), inputAmountWithFeeAndAfterTax);
    var outputAmount = sdkCore.CurrencyAmount.fromRawAmount(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator) // JSBI.divide will round down by itself, which is desired
    );
    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    var percentAfterBuyFees = calculateFotFees ? this.derivePercentAfterBuyFees(outputAmount) : ZERO_PERCENT;
    var outputAmountAfterTax = percentAfterBuyFees.greaterThan(ZERO_PERCENT) ? sdkCore.CurrencyAmount.fromRawAmount(outputAmount.currency, outputAmount.multiply(percentAfterBuyFees).quotient // fraction.quotient will round down by itself, which is desired
    ) : outputAmount;
    if (JSBI.equal(outputAmountAfterTax.quotient, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    return [outputAmountAfterTax, new Pair(inputReserve.add(inputAmountAfterTax), outputReserve.subtract(outputAmountAfterTax))];
  }
  /**
   * getAmountIn is the linear algebra of reserve ratio against amountIn:amountOut.
   * https://ethereum.stackexchange.com/questions/101629/what-is-math-for-uniswap-calculates-the-amountout-and-amountin-why-997-and-1000
   * has the math deduction for the reserve calculation without fee-on-transfer fees.
   *
   * With fee-on-transfer fees, intuitively it's just:
   * outputAmountWithTax = amountOut / (1 - amountOut.buyFeesBips / 10000)
   * inputAmountWithTax = amountIn / (1 - amountIn.sellFeesBips / 10000) / 0.997
   *
   * But we are illustrating the math deduction below to ensure that's the case.
   *
   * before swap A * B = K where A = reserveIn B = reserveOut
   *
   * after swap A' * B' = K where only k is a constant value
   *
   * getAmountIn
   *
   * B' = B - amountOut * (1 - amountOut.buyFeesBips / 10000)
   * A' = A + 0.997 * (1 - amountIn.sellFeesBips / 10000) * amountIn # here 0.3% is deducted
   * amountIn = (A' - A) / (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = (K / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)) - A)
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = (AB / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)) - A)
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = ((AB - AB + A * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = ((A * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
   *            /
   *            (0.997 * (1 - amountIn.sellFeesBips / 10000))
   *          = ((A * 1000 * amountOut / (1 - amountOut.buyFeesBips / 10000)) / (B - amountOut / (1 - amountOut.buyFeesBips / 10000)))
   *            /
   *            (997 * (1 - amountIn.sellFeesBips / 10000))
   *
   * outputAmountWithTax = amountOut / (1 - amountOut.buyFeesBips / 10000)
   * inputAmountWithTax = amountIn / (997 * (1 - amountIn.sellFeesBips / 10000))
   *                    = (A * outputAmountWithTax * 1000) / ((B - outputAmountWithTax) * 997)
   *
   * @param outputAmount
   */;
  _proto.getInputAmount = function getInputAmount(outputAmount, calculateFotFees) {
    if (calculateFotFees === void 0) {
      calculateFotFees = true;
    }
    !this.involvesToken(outputAmount.currency) ?  invariant(false, 'TOKEN')  : void 0;
    var percentAfterBuyFees = calculateFotFees ? this.derivePercentAfterBuyFees(outputAmount) : ZERO_PERCENT;
    var outputAmountBeforeTax = percentAfterBuyFees.greaterThan(ZERO_PERCENT) ? sdkCore.CurrencyAmount.fromRawAmount(outputAmount.currency, JSBI.add(outputAmount.divide(percentAfterBuyFees).quotient, ONE) // add 1 for rounding up
    ) : outputAmount;
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO) || JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient) || JSBI.greaterThanOrEqual(outputAmountBeforeTax.quotient, this.reserveOf(outputAmount.currency).quotient)) {
      throw new InsufficientReservesError();
    }
    var outputReserve = this.reserveOf(outputAmount.currency);
    var inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmountBeforeTax.quotient), _1000);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmountBeforeTax.quotient), _997);
    var inputAmount = sdkCore.CurrencyAmount.fromRawAmount(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE) // add 1 here is part of the formula, no rounding needed here, since there will not be decimal at this point
    );
    var percentAfterSellFees = calculateFotFees ? this.derivePercentAfterSellFees(inputAmount) : ZERO_PERCENT;
    var inputAmountBeforeTax = percentAfterSellFees.greaterThan(ZERO_PERCENT) ? sdkCore.CurrencyAmount.fromRawAmount(inputAmount.currency, JSBI.add(inputAmount.divide(percentAfterSellFees).quotient, ONE) // add 1 for rounding up
    ) : inputAmount;
    return [inputAmountBeforeTax, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };
  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.currency.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    var liquidity;
    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(sdkCore.sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    return sdkCore.CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity);
  };
  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    !totalSupply.currency.equals(this.liquidityToken) ?  invariant(false, 'TOTAL_SUPPLY')  : void 0;
    !liquidity.currency.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    !JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var totalSupplyAdjusted;
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ?  invariant(false, 'K_LAST')  : void 0;
      var kLastParsed = JSBI.BigInt(kLast);
      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sdkCore.sqrt(JSBI.multiply(this.reserve0.quotient, this.reserve1.quotient));
        var rootKLast = sdkCore.sqrt(kLastParsed);
        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.quotient, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(sdkCore.CurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }
    return sdkCore.CurrencyAmount.fromRawAmount(token, JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupplyAdjusted.quotient));
  };
  _proto.derivePercentAfterSellFees = function derivePercentAfterSellFees(inputAmount) {
    var sellFeeBips = this.token0.wrapped.equals(inputAmount.wrapped.currency) ? this.token0.wrapped.sellFeeBps : this.token1.wrapped.sellFeeBps;
    if (sellFeeBips != null && sellFeeBips.gt(bignumber.BigNumber.from(0))) {
      return ONE_HUNDRED_PERCENT.subtract(new sdkCore.Percent(JSBI.BigInt(sellFeeBips)).divide(BASIS_POINTS));
    } else {
      return ZERO_PERCENT;
    }
  };
  _proto.derivePercentAfterBuyFees = function derivePercentAfterBuyFees(outputAmount) {
    var buyFeeBps = this.token0.wrapped.equals(outputAmount.wrapped.currency) ? this.token0.wrapped.buyFeeBps : this.token1.wrapped.buyFeeBps;
    if (buyFeeBps != null && buyFeeBps.gt(bignumber.BigNumber.from(0))) {
      return ONE_HUNDRED_PERCENT.subtract(new sdkCore.Percent(JSBI.BigInt(buyFeeBps)).divide(BASIS_POINTS));
    } else {
      return ZERO_PERCENT;
    }
  };
  return _createClass(Pair, [{
    key: "token0Price",
    get: function get() {
      var result = this.tokenAmounts[1].divide(this.tokenAmounts[0]);
      return new sdkCore.Price(this.token0, this.token1, result.denominator, result.numerator);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
  }, {
    key: "token1Price",
    get: function get() {
      var result = this.tokenAmounts[0].divide(this.tokenAmounts[1]);
      return new sdkCore.Price(this.token1, this.token0, result.denominator, result.numerator);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].currency;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].currency;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);
}();

var Route = /*#__PURE__*/function () {
  function Route(pairs, input, output) {
    this._midPrice = null;
    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    var chainId = pairs[0].chainId;
    !pairs.every(function (pair) {
      return pair.chainId === chainId;
    }) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    var wrappedInput = input.wrapped;
    !pairs[0].involvesToken(wrappedInput) ?  invariant(false, 'INPUT')  : void 0;
    !(typeof output === 'undefined' || pairs[pairs.length - 1].involvesToken(output.wrapped)) ?  invariant(false, 'OUTPUT')  : void 0;
    var path = [wrappedInput];
    for (var _iterator = _createForOfIteratorHelperLoose(pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
        i = _step$value[0],
        pair = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pair.token0) || currentInput.equals(pair.token1)) ?  invariant(false, 'PATH')  : void 0;
      var _output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;
      path.push(_output);
    }
    this.pairs = pairs;
    this.path = path;
    this.input = input;
    this.output = output;
  }
  return _createClass(Route, [{
    key: "midPrice",
    get: function get() {
      if (this._midPrice !== null) return this._midPrice;
      var prices = [];
      for (var _iterator2 = _createForOfIteratorHelperLoose(this.pairs.entries()), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
          i = _step2$value[0],
          pair = _step2$value[1];
        prices.push(this.path[i].equals(pair.token0) ? new sdkCore.Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.quotient, pair.reserve1.quotient) : new sdkCore.Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.quotient, pair.reserve0.quotient));
      }
      var reduced = prices.slice(1).reduce(function (accumulator, currentValue) {
        return accumulator.multiply(currentValue);
      }, prices[0]);
      return this._midPrice = new sdkCore.Price(this.input, this.output, reduced.denominator, reduced.numerator);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.pairs[0].chainId;
    }
  }]);
}();

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.currency.equals(b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !a.outputAmount.currency.equals(b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    }
    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}
// extension of the input output comparator that also considers other dimensions of the trade in ranking them
function tradeComparator(a, b) {
  var ioComp = inputOutputComparator(a, b);
  if (ioComp !== 0) {
    return ioComp;
  }
  // consider lowest slippage next, since these are less likely to fail
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  }
  // finally consider the number of hops since each hop costs gas
  return a.route.path.length - b.route.path.length;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
var Trade = /*#__PURE__*/function () {
  function Trade(route, amount, tradeType) {
    this.route = route;
    this.tradeType = tradeType;
    var tokenAmounts = new Array(route.path.length);
    if (tradeType === sdkCore.TradeType.EXACT_INPUT) {
      !amount.currency.equals(route.input) ?  invariant(false, 'INPUT')  : void 0;
      tokenAmounts[0] = amount.wrapped;
      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.pairs[i];
        var _pair$getOutputAmount = pair.getOutputAmount(tokenAmounts[i]),
          outputAmount = _pair$getOutputAmount[0];
        tokenAmounts[i + 1] = outputAmount;
      }
      this.inputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.input, amount.numerator, amount.denominator);
      this.outputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.output, tokenAmounts[tokenAmounts.length - 1].numerator, tokenAmounts[tokenAmounts.length - 1].denominator);
    } else {
      !amount.currency.equals(route.output) ?  invariant(false, 'OUTPUT')  : void 0;
      tokenAmounts[tokenAmounts.length - 1] = amount.wrapped;
      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.pairs[_i - 1];
        var _pair$getInputAmount = _pair.getInputAmount(tokenAmounts[_i]),
          inputAmount = _pair$getInputAmount[0];
        tokenAmounts[_i - 1] = inputAmount;
      }
      this.inputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.input, tokenAmounts[0].numerator, tokenAmounts[0].denominator);
      this.outputAmount = sdkCore.CurrencyAmount.fromFractionalAmount(route.output, amount.numerator, amount.denominator);
    }
    this.executionPrice = new sdkCore.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient);
    this.priceImpact = sdkCore.computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount);
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  Trade.exactIn = function exactIn(route, amountIn) {
    return new Trade(route, amountIn, sdkCore.TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */;
  Trade.exactOut = function exactOut(route, amountOut) {
    return new Trade(route, amountOut, sdkCore.TradeType.EXACT_OUTPUT);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */;
  var _proto = Trade.prototype;
  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;
    if (this.tradeType === sdkCore.TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      var slippageAdjustedAmountOut = new sdkCore.Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.quotient).quotient;
      return sdkCore.CurrencyAmount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */;
  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;
    if (this.tradeType === sdkCore.TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new sdkCore.Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.quotient).quotient;
      return sdkCore.CurrencyAmount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn);
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param nextAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param currencyAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */;
  Trade.bestTradeExactIn = function bestTradeExactIn(pairs, currencyAmountIn, currencyOut, _temp,
  // used in recursion.
  currentPairs, nextAmountIn, bestTrades) {
    var _ref = _temp === void 0 ? {} : _temp,
      _ref$maxNumResults = _ref.maxNumResults,
      maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
      _ref$maxHops = _ref.maxHops,
      maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops;
    if (currentPairs === void 0) {
      currentPairs = [];
    }
    if (nextAmountIn === void 0) {
      nextAmountIn = currencyAmountIn;
    }
    if (bestTrades === void 0) {
      bestTrades = [];
    }
    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(currencyAmountIn === nextAmountIn || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var amountIn = nextAmountIn.wrapped;
    var tokenOut = currencyOut.wrapped;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      // pair irrelevant
      if (!pair.token0.equals(amountIn.currency) && !pair.token1.equals(amountIn.currency)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountOut = void 0;
      try {
        ;
        var _pair$getOutputAmount2 = pair.getOutputAmount(amountIn);
        amountOut = _pair$getOutputAmount2[0];
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }
        throw error;
      }
      // we have arrived at the output token, so this is the final trade of one of the paths
      if (amountOut.currency.equals(tokenOut)) {
        sdkCore.sortedInsert(bestTrades, new Trade(new Route([].concat(currentPairs, [pair]), currencyAmountIn.currency, currencyOut), currencyAmountIn, sdkCore.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
        // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
        Trade.bestTradeExactIn(pairsExcludingThisPair, currencyAmountIn, currencyOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentPairs, [pair]), amountOut, bestTrades);
      }
    }
    return bestTrades;
  }
  /**
   * Return the execution price after accounting for slippage tolerance
   * @param slippageTolerance the allowed tolerated slippage
   */;
  _proto.worstExecutionPrice = function worstExecutionPrice(slippageTolerance) {
    return new sdkCore.Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param nextAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param currencyAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */;
  Trade.bestTradeExactOut = function bestTradeExactOut(pairs, currencyIn, currencyAmountOut, _temp2,
  // used in recursion.
  currentPairs, nextAmountOut, bestTrades) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$maxNumResults = _ref2.maxNumResults,
      maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
      _ref2$maxHops = _ref2.maxHops,
      maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops;
    if (currentPairs === void 0) {
      currentPairs = [];
    }
    if (nextAmountOut === void 0) {
      nextAmountOut = currencyAmountOut;
    }
    if (bestTrades === void 0) {
      bestTrades = [];
    }
    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(currencyAmountOut === nextAmountOut || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var amountOut = nextAmountOut.wrapped;
    var tokenIn = currencyIn.wrapped;
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      // pair irrelevant
      if (!pair.token0.equals(amountOut.currency) && !pair.token1.equals(amountOut.currency)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountIn = void 0;
      try {
        ;
        var _pair$getInputAmount2 = pair.getInputAmount(amountOut);
        amountIn = _pair$getInputAmount2[0];
      } catch (error) {
        // not enough liquidity in this pair
        if (error.isInsufficientReservesError) {
          continue;
        }
        throw error;
      }
      // we have arrived at the input token, so this is the first trade of one of the paths
      if (amountIn.currency.equals(tokenIn)) {
        sdkCore.sortedInsert(bestTrades, new Trade(new Route([pair].concat(currentPairs), currencyIn, currencyAmountOut.currency), currencyAmountOut, sdkCore.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
        // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
        Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, currencyAmountOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [pair].concat(currentPairs), amountIn, bestTrades);
      }
    }
    return bestTrades;
  };
  return Trade;
}();

function toHex(currencyAmount) {
  return "0x" + currencyAmount.quotient.toString(16);
}
var ZERO_HEX = '0x0';
/**
 * Represents the Uniswap V2 Router, and has static methods for helping execute trades.
 */
var Router = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Router() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  Router.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = trade.inputAmount.currency.isNative;
    var etherOut = trade.outputAmount.currency.isNative;
    // the router does not support both ether in and out
    !!(etherIn && etherOut) ?  invariant(false, 'ETHER_IN_OUT')  : void 0;
    !(!('ttl' in options) || options.ttl > 0) ?  invariant(false, 'TTL')  : void 0;
    var to = sdkCore.validateAndParseAddress(options.recipient);
    var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    var path = trade.route.path.map(function (token) {
      return token.address;
    });
    var deadline = 'ttl' in options ? "0x" + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16) : "0x" + options.deadline.toString(16);
    var useFeeOnTransfer = Boolean(options.feeOnTransfer);
    var methodName;
    var args;
    var value;
    switch (trade.tradeType) {
      case sdkCore.TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens';
          // (uint amountOutMin, address[] calldata path, address to, uint deadline)
          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH';
          // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens';
          // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        }
        break;
      case sdkCore.TradeType.EXACT_OUTPUT:
        !!useFeeOnTransfer ?  invariant(false, 'EXACT_OUT_FOT')  : void 0;
        if (etherIn) {
          methodName = 'swapETHForExactTokens';
          // (uint amountOut, address[] calldata path, address to, uint deadline)
          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = 'swapTokensForExactETH';
          // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = 'swapTokensForExactTokens';
          // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        }
        break;
    }
    return {
      methodName: methodName,
      args: args,
      value: value
    };
  };
  return Router;
}();

exports.FACTORY_ADDRESS_MAP = FACTORY_ADDRESS_MAP;
exports.INIT_CODE_HASH = INIT_CODE_HASH;
exports.InsufficientInputAmountError = InsufficientInputAmountError;
exports.InsufficientReservesError = InsufficientReservesError;
exports.MINIMUM_LIQUIDITY = MINIMUM_LIQUIDITY;
exports.Pair = Pair;
exports.Route = Route;
exports.Router = Router;
exports.Trade = Trade;
exports.computePairAddress = computePairAddress;
exports.inputOutputComparator = inputOutputComparator;
exports.tradeComparator = tradeComparator;
//# sourceMappingURL=v2-sdk.cjs.development.js.map
