/*
Calculator for probability distributions

copyright (c) 2013 by P.B. Stark
License: AGPL

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
                                        .append($('<input type="text" />').attr('size','paramDigits').addClass(parm))
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
                      .append($('<input type="text" />').addClass('loLim').attr('size',self.options['digits']).val("0").change(calcProb))
                      .append($('<input type="checkbox">').addClass('useUpper').click(calcProb))
                      .append('and X &le;')
                      .append($('<input type="text" />').addClass('hiLim').attr('size',self.options['digits']).val("0").change(calcProb))
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
        calcProb();
    }

    function calcProb() {
        var loLim = self.selectDiv.find('.useLower').prop('checked') ? 
                      parseInt(self.selectDiv.find('.loLim').val()) : false;
        var hiLim = self.selectDiv.find('.useUpper').prop('checked') ? 
                      parseInt(self.selectDiv.find('.hiLim').val()) : false;
        var prob = Number.NaN;

        switch(self.currDist) {
             case "Binomial":
                var n = self.distDivs[self.currDist].find('.n').val();
                var p = self.distDivs[self.currDist].find('.p').val();
                alert(binomialCdf(n, p, hiLim));
                var t = hiLim ? binomialCdf(n, p, hiLim) : 1.0;
                var b = loLim ? binomialCdf(n, p, loLim) : 0.0;
                prob = t - b;
                if (loLim) {
                   alert('loLim is true');
                }
                alert('hiLim, loLim, p, n, t, b, prob ' + hiLim + ' ' + loLim + ' ' + n + ' ' + p + ' ' + t + ' ' + b + ' ' + prob);
                break;

             case "Geometric":
                var p = self.distDivs[self.currDist].find('.p').val();
                var t = hiLim ? geoCdf(p, hiLim) : 1.0;
                var b = loLim ? geoCdf(p, loLim) : 0.0;
                prob = t - b;
                break;

             case "Negative Binomial":
                var p = self.distDivs[self.currDist].find('.p').val();
                var r = self.distDivs[self.currDist].find('.r').val();
                var t = hiLim ? negBinomialCdf( p,  r, hiLim) : 1.0;
                var b = loLim ? negBinomialCdf( p,  r, loLim) : 0.0;
                prob = t - b;
                break;
/*
             case "Hypergeometric":
                 ["N","G","n"]]
                  break;
             
             case "Normal":
                   ["mean","SD"]],
                  break;

             case "Student t": 
                  ["degrees of freedom"]]
                  break;

             case: "Chi-square":
                   ["degrees of freedom"]]
                  break;

             case: "Exponential":
                   ["mean"]]
                  break;

             case "Poisson":
                    mean;
                  break;
*/
             default:
                   console.log('unexpected distribution in probCalc.calcProb ' + dist);
        }
        self.theDisplay.val(prob.toString());
    }

}
