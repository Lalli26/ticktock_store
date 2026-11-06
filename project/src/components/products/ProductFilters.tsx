import { Box, Button, InputAdornment, MenuItem, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { ProductFilters } from '@/lib/filterProducts';
import { WATCH_CATEGORIES, type WatchCategory } from '@/types/product';

interface ProductFiltersProps {
  filters: ProductFilters;
  brands: string[];
  priceBounds: { min: number; max: number };
  onChange: (patch: Partial<ProductFilters>) => void;
  onReset: () => void;
}

const PRICE_STEP = 500;

export default function ProductFiltersPanel({ filters, brands, priceBounds, onChange, onReset }: ProductFiltersProps) {
  const handleCategoryChange = (_: unknown, value: WatchCategory | '' | null) => {
    onChange({ category: value ?? '' });
  };

  return (
    <Stack spacing={3.5}>
      <TextField
        fullWidth
        type="search"
        placeholder="Search by watch name"
        value={filters.query}
        onChange={(event) => onChange({ query: event.target.value })}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
          Category
        </Typography>
        <ToggleButtonGroup
          exclusive
          orientation="vertical"
          fullWidth
          value={filters.category}
          onChange={handleCategoryChange}
          sx={{
            '& .MuiToggleButton-root': {
              justifyContent: 'flex-start',
              textTransform: 'none',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mb: 1,
              '&.Mui-selected': { backgroundColor: 'primary.main', color: '#FFFFFF' },
              '&.Mui-selected:hover': { backgroundColor: 'primary.light' },
            },
          }}
        >
          <ToggleButton value="">All watches</ToggleButton>
          {WATCH_CATEGORIES.map((category) => (
            <ToggleButton key={category} value={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <TextField
        select
        fullWidth
        label="Brand"
        value={filters.brand}
        onChange={(event) => onChange({ brand: event.target.value })}
      >
        <MenuItem value="">All brands</MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand} value={brand}>
            {brand}
          </MenuItem>
        ))}
      </TextField>

      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Price range
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
          </Typography>
        </Stack>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          min={priceBounds.min}
          max={priceBounds.max}
          step={PRICE_STEP}
          color="secondary"
          disableSwap
          onChange={(_, value) => {
            const [minPrice, maxPrice] = value as number[];
            onChange({ minPrice, maxPrice });
          }}
          aria-label="Price range"
        />
      </Box>

      <Button variant="text" color="primary" onClick={onReset} sx={{ alignSelf: 'flex-start', px: 0 }}>
        Clear all filters
      </Button>
    </Stack>
  );
}
