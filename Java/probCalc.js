/*
Calculator for probability distributions

copyright (c) 2013 by P.B. Stark

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
    See the GNU Affero Public License for more details. 
    http://www.gnu.org/licenses/

Dependencies: irGrade,js, jQuery, jQuery-ui

*/

function probCalc(container_id, params) {
    var self = this;
    this.container = $('#' + container_id);

    if (!params instanceof Object) {
       console.error('probCalc parameters should be an object');
       return;
    }

// default options
    this.options = {
                    distributions: [ ["Binomial", ["n","p"]],
                                     ["Geometric", ["p"]],
                                     ["Negative Binomial", ["p","r"]],
                                     ["Hypergeometric",["N","G","n"]],
                                     ["Normal", ["mean","SD"]],
                                     ["Student t", ["degrees of freedom"]],
                                     ["Chi-square", ["degrees of freedom"]],
                                     ["Exponential", ["mean"]],
                                     ["Poisson", ["mean"]]
                                   ],
                    digits: 20,
                    paramDigits: 4
    };

// Extend options
    $.extend(this.options, params);

    self.lo = 0.0;
    self.hi = 0.0;
    self.currDist = null;
    self.distDivs = new Array();

    function init() {
        var me = $('<div />').addClass('probCalc');
        self.container.append(me);
 
        // distribution selection
        self.selectDiv = $('<div />').addClass('selectDiv').append('If X has a ');
        self.selectDist = $('<select />').change(function() {
              changeDist($(this).val());
        });

        // parameters of the distributions
        $.each(self.options['distributions'], function(i, v) {
               $('<option/>', { value : v[0] }).text(v[0]).appendTo(self.selectDist);
               self.distDivs[v[0]] = $('<div />').css('display','inline');
               $.each(v[1], function(j, parm) {
                     self.distDivs[v[0]].append(parm + ' = ')
                                        .append(  $('<input type="text" />')
                                                    .attr('size','paramDigits')
                                                    .addClass(parm.replace(/ +/g,'_'))
                                                    .blur(calcProb)
                                        )
                                        .append(', ');
               });
        })
 
        self.paramSpan = $('<span />').addClass('paramSpan');
        self.selectDiv.append(self.selectDist)
                      .append('distribution with ')
                      .append(self.paramSpan);
       
        // start with the first listed distribution
        self.currDist = self.options['distributions'][0][0];
        self.paramSpan.append(self.distDivs[self.currDist]);

        // range over which to find the probability
        self.selectDiv.append(' the chance that ')
                      .append($('<input type="checkbox">').addClass('useLower').click(calcProb))
                      .append('X &ge;')
                      .append($('<input type="text" />').addClass('loLim').attr('size',self.options['digits']).val("0").blur(calcProb))
                      .append($('<input type="checkbox">').addClass('useUpper').click(calcProb))
                      .append('and X &le;')
                      .append($('<input type="text" />').addClass('hiLim').attr('size',self.options['digits']).val("0").blur(calcProb))
                      .append(' is ');

        // display
        self.theDisplay = $('<input type="text" readonly />').attr('size',self.options['digits']);
        self.selectDiv.append(self.theDisplay);
        me.append(self.selectDiv);
    }
    init();

//  action functions

    function changeDist(dist) {
        self.currDist = dist;
        self.paramSpan.empty();
        var thisDist = $.grep(self.options['distributions'], function(v,i) {
                          return(v[0] === dist);
        });
        self.paramSpan.append(self.distDivs[thisDist[0][0]]);  // replace with parameters for current distribution
        self.theDisplay.val('NaN');
        calcProb();
    }

    function calcProb() {
        var prob  = Number.NaN;

        var loCk  = self.selectDiv.find('.useLower').prop('checked');
        var loLim = loCk ? parseInt(self.selectDiv.find('.loLim').val()) : Number.NaN;
        var hiCk  = self.selectDiv.find('.useUpper').prop('checked');
        var hiLim = hiCk ? parseInt(self.selectDiv.find('.hiLim').val()) : Number.NaN;

        if (loCk && hiCk && (loLim >= hiLim)) {
              prob = 0.0;
        } else if (!loCk && !hiCk) {
              prob = Number.NaN;
        } else {

              switch(self.currDist) {
                   case "Binomial":
                      var n = parseFloat(self.distDivs[self.currDist].find('.n').val());
                      var p = parsePercent(self.distDivs[self.currDist].find('.p').val());
                      var t = hiCk ? binomialCdf(n, p, hiLim) : 1.0;
                      var b = loCk ? binomialCdf(n, p, loLim-1) : 0.0;
                      prob = t - b;
                      break;

                   case "Geometric":
                      var p = parsePercent(self.distDivs[self.currDist].find('.p').val());
                      var t = hiCk ? geoCdf(p, hiLim) : 1.0;
                      var b = loCk ? geoCdf(p, loLim-1) : 0.0;
                      prob = t - b;
                      break;

                   case "Negative Binomial":
                      var p = parsePercent(self.distDivs[self.currDist].find('.p').val());
                      var r = parseFloat(self.distDivs[self.currDist].find('.r').val());
                      var t = hiCk ? negBinomialCdf( p,  r, hiLim) : 1.0;
                      var b = loCk ? negBinomialCdf( p,  r, loLim-1) : 0.0;
                      prob = t - b;
                      break;

                   case "Hypergeometric":
                      var N = parseFloat(self.distDivs[self.currDist].find('.N').val());
                      var G = parseFloat(self.distDivs[self.currDist].find('.G').val());
                      var n = parseFloat(self.distDivs[self.currDist].find('.n').val());
                      var t = hiCk ? hyperGeoCdf(N,  G, n, hiLim) : 1.0;
                      var b = loCk ? hyperGeoCdf(N,  G, n, loLim-1) : 0.0;
                      prob = t - b;
                      break;
                   
                   case "Normal":
                      var m = parseFloat(self.distDivs[self.currDist].find('.mean').val());
                      var s = parseFloat(self.distDivs[self.currDist].find('.SD').val());
                      var t = hiCk ? normCdf(m, s, hiLim) : 1.0;
                      var b = loCk ? normCdf(m, s, loLim) : 0.0;
                      prob = t - b;
                      break;

                   case "Student t": 
                      var df = parseFloat(self.distDivs[self.currDist].find('.degrees_of_freedom').val());
                      var t = hiCk ? tCdf(df, hiLim) : 1.0;
                      var b = loCk ? tCdf(df, loLim) : 0.0;
                      prob = t - b;
                      break;

                   case "Chi-square":
                      var df = parseFloat(self.distDivs[self.currDist].find('.degrees_of_freedom').val());
                      var t = hiCk ? chi2Cdf(df, hiLim) : 1.0;
                      var b = loCk ? chi2Cdf(df, loLim) : 0.0;
                      prob = t - b;
                      break;

                   case "Exponential":
                      var m = parseFloat(self.distDivs[self.currDist].find('.mean').val());
                      var t = hiCk ? expCdf(m, hiLim) : 1.0;
                      var b = loCk ? expCdf(m, loLim) : 0.0;
                      prob = t - b;
                      break;

                   case "Poisson":
                      var m = parseFloat(self.distDivs[self.currDist].find('.mean').val());
                      var t = hiCk ? poissonCdf(m, hiLim) : 1.0;
                      var b = loCk ? poissonCdf(m, loLim) : 0.0;
                      prob = t - b;
                      break;

                   default:
                      console.log('unexpected distribution in probCalc.calcProb ' + dist);
              }
        }
        self.theDisplay.val(prob.toString());
    }

}
