import { Router } from 'express';
import { db, createNotification } from '../db';

const router = Router();

// GET /api/lost-found - List items
router.get('/', async (req, res) => {
  try {
    const type = req.query.type as string; // 'lost' | 'found' | 'all'
    let query = db.from('lost_found_items').select('*').order('created_at', { ascending: false });

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ items: data || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch lost & found items' });
  }
});

// POST /api/lost-found - Report an item
router.post('/', async (req, res) => {
  try {
    const { title, description, category, location, type, contactEmail, contactPhone, reporterId, reporterName } = req.body;

    if (!title || !category || !location || !type) {
      return res.status(400).json({ error: 'Title, category, location, and type are required' });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reporterId);
    const targetReporter = isUuid ? reporterId : 'a13698dc-ee1d-4d73-9302-b68e1df153cc';

    const { data, error } = await db
      .from('lost_found_items')
      .insert({
        title,
        description: description || '',
        category,
        location,
        reported_by: targetReporter,
        status: 'OPEN',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Check for potential matching items
    const oppositeType = type === 'lost' ? 'found' : 'lost';
    const { data: potentialMatches } = await db
      .from('lost_found_items')
      .select('id, title, location, type')
      .eq('type', oppositeType)
      .eq('category', category)
      .eq('status', 'OPEN');

    res.json({
      item: data,
      matchesFound: potentialMatches?.length || 0,
      matches: potentialMatches || [],
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to report item' });
  }
});

// POST /api/lost-found/:id/claim - Submit claim
router.post('/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const { claimantId, claimantName, proofDetails } = req.body;

    const { data: item } = await db.from('lost_found_items').select('*').eq('id', id).single();
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { data, error } = await db
      .from('lost_found_items')
      .update({
        status: 'CLAIMED',
        claimant_id: claimantId || null,
        claimant_name: claimantName || 'Student',
        claim_notes: proofDetails || 'Claim submitted with proof of ownership',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Notify original reporter if available
    if (item.reporter_id) {
      await createNotification(
        item.reporter_id,
        'lost_found_claimed',
        `Claim Submitted for "${item.title}"`,
        `${claimantName || 'A student'} has submitted a claim for this item. Security will review proof at Gymkhana Security Desk.`
      );
    }

    res.json({ item: data, message: 'Claim submitted for administrative verification.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit claim' });
  }
});

export default router;
