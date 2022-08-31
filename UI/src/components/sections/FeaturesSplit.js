import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';


const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: 'Workflow that just works',
    paragraph: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum — semper quis lectus nulla at volutpat diam ut venenatis.'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Step 1
                  </div>
                <h3 className="mt-0 mb-12">
                  Define the conditions
                  </h3>
                <p className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-01.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Step 2
                  </div>
                <h3 className="mt-0 mb-12">
                  Write the contract
                  </h3>
                <p className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-02.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>


            

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Step 3
                  </div>
                <h3 className="mt-0 mb-12">
                  Sign The Contract
                  </h3>
                <p className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../assets/images/features-split-image-03.png')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className>
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
 
                <h1 className="mt-20 mb-20 ">
                  Roadmap
                  </h1>
               
              </div>

              <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  End of April 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  PAPER 1 and PROTOTYPE 1: Recurring Economic Transaction
                  </h3>
                <p className="m-0">
                  The results of the work will be published in the Q2 IEEE. 
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/right.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>


            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  May 11-13, 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  UNIVERSITY OF EDINBURGH: Economics of Financial Technology Conference Programme
                  </h3>
                <p className="m-0">
                  Universal contract on Blockchain, presented by Razvan Mihai. 
                  https://edinburghuni.eventsair.com/economics-of-financial-technology-conference
                   
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/left.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>




            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  June 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  PAPER 2 and PROTOTYPE 2: Automated recurring payments
                  </h3>
                <p className="m-0">
                  The results of this work will be published in the Q3 of IEEE.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/right.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>


            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  July 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  PAPER 3 and PROTOTYPE 3: Universal Contract on Blockchain
                  </h3>
                <p className="m-0">
                  The paper and the prototype will include the work from Paper 1 and Paper 2 with the aim to be published in the October 2022 and November 2022 IEEE conference.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/left.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>


            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  August 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  FINAL PROTOTYPE 
                  </h3>
                <p className="m-0">
                  At this stage we plan on having a final prototype working on testnest. This will include the final form of the smart contract, back end and front end as well as community feedback.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/right.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>



            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  October 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  IEEE Conference Bucharest
                  </h3>
                <p className="m-0">
                  More details coming soon.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/left.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>


            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  November 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  IEEE Conference US
                  </h3>
                <p className="m-0">
                More details coming soon.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/right.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>




            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  November 2022
                  </div>
                <h3 className="mt-0 mb-12">
                  WORKSHOP 
                  </h3>
                <p className="m-0">
                More details coming soon.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content reveal-from-bottom',
                  imageFill && 'split-item-image'
                )}
                data-reveal-container=".split-item">
               <Image
                  src={require('./../../assets/images/left.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} /> 
              </div>
            </div>


            


 
            </div>

          </div>
        </div>
      </div>
    </section>
  );

  
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;