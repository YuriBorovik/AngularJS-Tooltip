/**
 *   Created by: Yuri Borovik
 *   Email: yuri.borovik@gmail.com
 *   Date: 14.04.2016
 *   Time: 16:19
 *
 */
/// <reference path="../../typings/angularjs/angular.d.ts" />;
module MainTooltip {
    export class Tooltip {
        public static $inject = ['$timeout'];

        constructor($timeout) {
            let directive = {
                bindToController: true,
                controller: TooltipController,
                controllerAs: 'ltTooltip',
                link: link,
                restrict: 'A',
                scope: {
                    color: '@ltTooltipColor',
                    position: '@ltTooltipPosition',
                    tooltip: '@ltTooltip'
                }
            };

            function link(scope, element, attrs, ctrl) {
                if (angular.isDefined(attrs.tooltipPosition)) {
                    attrs.$observe('tooltipPosition', function (newValue) {
                        scope.ltTooltip.position = newValue;
                    });
                }

                element.on('mouseenter', ctrl.showTooltip);
                element.on('mouseleave', ctrl.hideTooltip);

                scope.$on('$destroy', function () {
                    element.off();
                });
            }
            TooltipController.$inject = ['$element', '$scope', '$timeout'];
            function TooltipController($element, $scope, $timeout) {
                let ltTooltip = this;
                let timer1;
                let timer2;
                let tooltip;
                let tooltipBackground;
                let tooltipLabel;

                ltTooltip.hideTooltip = hideTooltip;
                ltTooltip.showTooltip = showTooltip;

                ltTooltip.position = angular.isDefined(ltTooltip.position) ? ltTooltip.position : 'top';

                $scope.$on('$destroy', function () {
                    if (angular.isDefined(tooltip)) {
                        tooltip.remove();
                    }

                    $timeout.cancel(timer1);
                    $timeout.cancel(timer2);
                });

                ////////////

                function hideTooltip() {
                    if (angular.isDefined(tooltip)) {
                        tooltip.removeClass('lt-tooltip--is-active');

                        timer1 = $timeout(function () {
                            tooltip.remove();
                        }, 200);
                    }
                }

                function setTooltipPosition() {
                    let width = $element.outerWidth(),
                        height = $element.outerHeight(),
                        top = $element.offset().top,
                        left = $element.offset().left;

                    tooltip
                        .append(tooltipBackground)
                        .append(tooltipLabel)
                        .appendTo('body');

                    if (ltTooltip.position === 'top') {
                        tooltip.css(
                            {
                                left: left - (tooltip.outerWidth() / 2) + (width / 2),
                                top: top - tooltip.outerHeight()
                            });
                    } else if (ltTooltip.position === 'bottom') {
                        tooltip.css(
                            {
                                left: left - (tooltip.outerWidth() / 2) + (width / 2),
                                top: top + height
                            });
                    } else if (ltTooltip.position === 'left') {
                        tooltip.css(
                            {
                                left: left - tooltip.outerWidth(),
                                top: top + (height / 2) - (tooltip.outerHeight() / 2)
                            });
                    } else if (ltTooltip.position === 'right') {
                        tooltip.css(
                            {
                                left: left + width,
                                top: top + (height / 2) - (tooltip.outerHeight() / 2)
                            });
                    }
                }

                function showTooltip() {
                    tooltip = angular.element('<div/>',
                        {
                            class: 'lt-tooltip lt-tooltip--' + ltTooltip.position + ' ' + ltTooltip.color
                        });

                    tooltipBackground = angular.element('<div/>',
                        {
                            class: 'lt-tooltip__background'
                        });

                    tooltipLabel = angular.element('<span/>',
                        {
                            class: 'lt-tooltip__label',
                            text: ltTooltip.tooltip
                        });

                    setTooltipPosition();

                    tooltip
                        .append(tooltipBackground)
                        .append(tooltipLabel)
                        .css('z-index', '1099')
                        .appendTo('body');

                    timer2 = $timeout(function () {
                        tooltip.addClass('lt-tooltip--is-active');
                    });
                }
            }

            return directive;
        }
    }

    angular.module('app.ui')
        .directive('ltTooltip', Tooltip);
}