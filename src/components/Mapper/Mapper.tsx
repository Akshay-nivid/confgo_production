import React, { memo, useCallback, useMemo, ComponentType } from 'react';

// Type for the key extractor function
type KeyExtractor<T> = (item: T, index: number) => string | number;

// Type for custom props to be passed to each item
type ItemProps<T> = {
  item: T;
  index: number;
  helperData?: T;
};

// Props for the Mapper component
interface MapperProps<T> {
  // The data array to map over
  MapperData: T[];

  helperData?: T;
  // The component to render for each item
  component: ComponentType<ItemProps<T>>;
  // Optional key extractor function
  keyExtractor?: KeyExtractor<T>;
  // Optional loading state
  isLoading?: boolean;
  // Optional loading component
  LoadingComponent?: ComponentType;
  // Optional empty state component
  EmptyComponent?: ComponentType;
  // Optional className for the wrapper
  className?: string;
  // Optional wrapper component
  WrapperComponent?: ComponentType<{ children: React.ReactNode }>;
  // Optional limit for rendering
  limit?: number;
  // Optional callback when reaching the end
  onEndReached?: () => void;
  // Optional threshold for end reached
  endReachedThreshold?: number;
}

const defaultKeyExtractor = (_: any, index: number) => index;

/**
 * MapperComponent is a generic component used to render a list of items by mapping over the provided data.
 * It supports various customization options, including custom components for individual items, loading state,
 * empty state, and infinite scrolling.
 *
 * @template T - The type of the items in the data array.
 *
 * @param {T[]} MapperData - The array of data that need to be mapped over to render .
 * @param {T} [helperData] - Optional additional data that can be passed to each rendered item.
 * @param {ComponentType<ItemProps<T>>} component - The component to render for each item.
 * @param {KeyExtractor<T>} [keyExtractor=defaultKeyExtractor] - Function to extract a unique key for each item.
 * @param {boolean} [isLoading=false] - Flag to indicate loading state.
 * @param {ComponentType} [LoadingComponent] - Optional component to render during loading state.
 * @param {ComponentType} [EmptyComponent] - Optional component to render when data is empty.
 * @param {string} [className] - Optional class name for the wrapper element.
 * @param {ComponentType<{ children: React.ReactNode }>} [WrapperComponent] - Optional component to wrap the list.
 * @param {number} [limit] - Optional limit for the number of items to render.
 * @param {() => void} [onEndReached] - Optional callback invoked when the end of the list is reached.
 * @param {number} [endReachedThreshold=0.8] - Threshold for triggering the `onEndReached` callback.
 */

function MapperComponent<T>({
  MapperData,
  helperData,
  component: Component,
  keyExtractor = defaultKeyExtractor,
  isLoading = false,
  LoadingComponent,
  EmptyComponent,
  className,
  WrapperComponent,
  limit,
  onEndReached,
  endReachedThreshold = 0.8,
}: MapperProps<T>) {
  // Memoize the data slice if limit is provided
  const limitedData = useMemo(() => {
    if (limit && limit > 0) {
      return MapperData.slice(0, limit);
    }
    return MapperData;
  }, [MapperData, limit]);

  // Memoize the intersection observer callback
  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && onEndReached) {
        onEndReached();
      }
    },
    [onEndReached]
  );

  // Create intersection observer for infinite scroll
  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !onEndReached) return;

      const observer = new IntersectionObserver(intersectionCallback, {
        root: null,
        rootMargin: '0px',
        threshold: endReachedThreshold,
      });

      observer.observe(node);

      return () => observer.disconnect();
    },
    [intersectionCallback, endReachedThreshold]
  );

  // Render loading state
  if (isLoading && LoadingComponent) {
    return <LoadingComponent />;
  }

  // Render empty state
  if (!isLoading && (!MapperData || MapperData.length === 0) && EmptyComponent) {
    return <EmptyComponent />;
  }

  // Memoize the mapped items
  const items = useMemo(
    () => limitedData.map((item, index) => <Component key={keyExtractor(item, index)} item={item} index={index} helperData={helperData} />),
    [limitedData, Component, keyExtractor]
  );

  // Render with wrapper if provided
  if (WrapperComponent) {
    return (
      <WrapperComponent>
        {items}
        {onEndReached && <div ref={observerRef} />}
      </WrapperComponent>
    );
  }

  // Default render
  return (
    <div className={className}>
      {items}
      {onEndReached && <div ref={observerRef} />}
    </div>
  );
}

// Memoize the entire component
export const Mapper = memo(MapperComponent) as typeof MapperComponent;

// Export types for consumer usage
export type { MapperProps, KeyExtractor, ItemProps };
