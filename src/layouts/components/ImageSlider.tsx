// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import { Direction } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'

const ImageSlider = ({
  direction,
  urls,
  initialIndex
}: {
  direction: Direction
  urls: Array<string>
  initialIndex?: number
}) => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(initialIndex || 0)
  const [sliderKey, setSliderKey] = useState<number>(0)

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    initial: initialIndex,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    }
  })

  useEffect(() => {
    setSliderKey(prevKey => prevKey + 1)
  }, [urls])

  return (
    <KeenSliderWrapper>
      <Box key={sliderKey} className='navigation-wrapper'>
        <Box ref={sliderRef} className='keen-slider'>
          {urls.map((url: string) => {
            return (
              <Box key={url} sx={{ aspectRatio: '3/2', objectFit: 'contain' }} className='keen-slider__slide'>
                <Box
                  component='img'
                  sx={{ aspectRatio: '3/2', width: '100%', objectFit: 'contain' }}
                  src={url}
                  onError={event => {
                    event.currentTarget.src = '/images/No-image-found.jpg'
                  }}
                />
              </Box>
            )
          })}
        </Box>
        {loaded && instanceRef.current && (
          <>
            <Icon
              icon='tabler:chevron-left'
              className={clsx('arrow arrow-left', {
                'arrow-disabled': currentSlide === 0
              })}
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            />

            <Icon
              icon='tabler:chevron-right'
              className={clsx('arrow arrow-right', {
                'arrow-disabled': currentSlide === instanceRef.current.track.details.slides.length - 1
              })}
              onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            />
          </>
        )}
      </Box>
      {loaded && instanceRef.current && (
        <Box className='swiper-dots'>
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
            return (
              <Badge
                key={idx}
                variant='dot'
                component='div'
                className={clsx({
                  active: currentSlide === idx
                })}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx)
                }}
              ></Badge>
            )
          })}
        </Box>
      )}
    </KeenSliderWrapper>
  )
}

export default ImageSlider
