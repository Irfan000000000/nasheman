import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReceiptIcon from '@mui/icons-material/Receipt';

const iconMap = {
  employee: <PeopleIcon style={{ color: '#000000' }} />,
  students: <SchoolIcon style={{ color: '#000000' }} />,
  parents: <PersonIcon style={{ color: '#000000' }} />,
  complaints: <FeedbackIcon style={{ color: '#000000' }} />,
  voucher: <ReceiptIcon style={{ color: '#000000' }} />,
  income: <AttachMoneyIcon style={{ color: '#000000' }} />,
};

function StatCard({ icon, title, value, description, backgroundColor = '#FFF' }) {
  return (
    <Card
      className="stat-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: { xs: 1.25, sm: 1.75, md: 2 },
        backgroundColor,
        borderRadius: 2,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent
        sx={{
          width: '100%',
          padding: '0 !important',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: { xs: 22, sm: 26, md: 30 },
              '& svg': { fontSize: 'inherit' },
            }}
          >
            {iconMap[icon]}
          </Box>
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
              fontWeight: 600,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          component="div"
          sx={{
            color: '#000',
            fontWeight: 700,
            fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.75rem' },
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
      </CardContent>

      <Box sx={{ width: '100%', mt: 1, borderBottom: 2, borderColor: '#000' }} />

      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          mt: 1,
          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
          letterSpacing: '0.3px',
          lineHeight: 1.3,
        }}
      >
        {description}
      </Typography>
    </Card>
  );
}

export default StatCard;
