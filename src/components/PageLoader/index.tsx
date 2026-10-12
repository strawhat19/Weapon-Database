import './styles.scss';
import { assetUrl } from '../../shared/assets';
import { usePageLoader } from './usePageLoader';
import { useMemo, type ReactNode, type CSSProperties } from 'react';
import { PageLoadingContext } from '../../shared/pageLoadingContext';
import { themePalettes, themeCssVariables } from '../../styles/theme/theme';

const materialStyles = {
  colorScheme: `dark`,
  ...themeCssVariables(themePalettes.dark),
  '--loader-steel': `url("${assetUrl(`textures/dark-brushed-steel.png`)}")`,
} as CSSProperties;

const PageLoader = ({ children }: { children: ReactNode }) => {
  const { root, content, progress, percent, visible, stage, reportModelSettled } = usePageLoader();
  const context = useMemo(() => ({ reportModelSettled }), [reportModelSettled]);
  return <PageLoadingContext.Provider value={context}>
    <div ref={root} id={`page-loader-shell`} className={`page-loader-shell`}>
      <div ref={content} inert={visible} id={`page-content`} data-loading={visible} aria-busy={visible} className={`page-loader-shell__content`}>
        {children}
      </div>
      {visible && <div id={`page-loader`} className={`page-loader`} style={materialStyles}>
        <div id={`page-loader-door-left`} aria-hidden={true} className={`page-loader__door page-loader__door--left`} />
        <div id={`page-loader-door-right`} aria-hidden={true} className={`page-loader__door page-loader__door--right`} />
        <div id={`page-loader-content`} className={`page-loader__content`}>
          <p id={`page-loader-archive`} className={`mono page-loader__archive`}><span aria-hidden={true} />{`Weapon Database / Archive`}</p>
          <div id={`page-loader-lock`} className={`page-loader__lock`} aria-hidden={true}>
            <div id={`page-loader-dial`} className={`page-loader__dial`} />
            {[`north`, `east`, `south`, `west`].map((side, index) => <span
              key={side}
              id={`page-loader-bolt-${index}`}
              className={`page-loader__bolt page-loader__bolt--${side}`}
            />)}
            <div id={`page-loader-crest`} className={`page-loader__crest`}>
              {[`left`, `right`].map((side, index) => <img
                alt={``}
                key={side}
                width={176}
                height={204}
                draggable={false}
                aria-hidden={true}
                src={assetUrl(`brand/crest.svg`)}
                id={`page-loader-crest-half-${index}`}
                className={`page-loader__crest-half page-loader__crest-half--${side}`}
              />)}
              <img
                alt={``}
                width={176}
                height={204}
                draggable={false}
                aria-hidden={true}
                id={`page-loader-crest-scan`}
                className={`page-loader__crest-scan`}
                src={assetUrl(`brand/crest.svg`)}
              />
            </div>
          </div>
          <h1 id={`page-loader-title`} className={`page-loader__title`}>{`Opening The Vault`}</h1>
          <div id={`page-loader-counter`} className={`page-loader__counter`} aria-hidden={true}>
            <span ref={percent} id={`page-loader-digits`} className={`page-loader__digits`}>{`00`}</span>
            <span id={`page-loader-percent`} className={`page-loader__percent`}>{`%`}</span>
          </div>
          <div
            ref={progress}
            role={`progressbar`}
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
            id={`page-loader-progress`}
            aria-label={`Opening The Vault`}
            className={`page-loader__progress`}
          ><span id={`page-loader-progress-fill`} className={`page-loader__progress-fill`} /></div>
          <div id={`page-loader-cartridges`} className={`page-loader__cartridges`} aria-hidden={true}>
            {Array.from({ length: 10 }, (_, index) => <span key={index} id={`page-loader-cartridge-${index}`} className={`page-loader__cartridge`} />)}
          </div>
          <p role={`status`} aria-live={`polite`} id={`page-loader-state`} className={`mono page-loader__state`}>{stage}</p>
        </div>
        <span id={`page-loader-edge-left`} className={`mono page-loader__edge page-loader__edge--left`} aria-hidden={true}>{`WD / VAULT`}</span>
        <span id={`page-loader-edge-right`} className={`mono page-loader__edge page-loader__edge--right`} aria-hidden={true}>{`Archive Access`}</span>
      </div>}
    </div>
  </PageLoadingContext.Provider>;
};

export default PageLoader;
